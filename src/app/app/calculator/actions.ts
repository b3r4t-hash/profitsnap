'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calculate, calculatorSchema } from '@/lib/calculator'
import type { CalculatorResult } from '@/types'

type ActionResult =
  | { success: true;  result: CalculatorResult; savedId?: string }
  | { success: false; error: string }

export async function calculateAndSave(
  formData: FormData
): Promise<ActionResult> {
  // 1. Parse + validate
  const raw = {
    productName:   formData.get('productName'),
    purchasePrice: formData.get('purchasePrice'),
    sellingPrice:  formData.get('sellingPrice'),
    shippingCost:  formData.get('shippingCost'),
    category:      formData.get('category'),
  }

  const parsed = calculatorSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Données invalides'
    return { success: false, error: firstError }
  }

  // 2. Run calculation (pure, no DB needed)
  const result = calculate(parsed.data)

  // 3. Auth check
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  // 4. Check daily limit for free plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, daily_calc_count, daily_reset_date')
    .eq('id', user.id)
    .single()

  if (!profile) return { success: false, error: 'Profil introuvable' }

  const today = new Date().toISOString().slice(0, 10)
  const isNewDay = profile.daily_reset_date !== today
  const currentCount = isNewDay ? 0 : profile.daily_calc_count

  if (profile.plan === 'free' && currentCount >= 3) {
    return {
      success: false,
      error: 'LIMIT_REACHED', // Special code caught by UI to show upsell modal
    }
  }

  // 5. Save calculation
  const { data: saved, error: saveError } = await supabase
    .from('calculations')
    .insert({
      user_id:       user.id,
      product_name:  parsed.data.productName ?? null,
      purchase_price: parsed.data.purchasePrice,
      selling_price:  parsed.data.sellingPrice,
      shipping_cost:  parsed.data.shippingCost,
      ebay_fees_pct:  result.ebayFeesPct,
      net_profit:     result.netProfit,
      margin_pct:     result.marginPct,
      roi_pct:        result.roiPct,
      is_profitable:  result.isProfitable,
      verdict:        result.verdict,
    })
    .select('id')
    .single()

  if (saveError) {
    // Don't block the user — return result without savedId
    console.error('Save error:', saveError)
    return { success: true, result }
  }

  // 6. Increment daily counter
  await supabase
    .from('profiles')
    .update({
      daily_calc_count: isNewDay ? 1 : currentCount + 1,
      daily_reset_date: today,
    })
    .eq('id', user.id)

  revalidatePath('/app/history')
  revalidatePath('/app/calculator')

  return { success: true, result, savedId: saved.id }
}
