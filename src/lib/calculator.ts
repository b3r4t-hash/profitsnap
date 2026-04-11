import type { CalculatorInput, CalculatorResult, EbayCategory } from '@/types'

// ─── eBay fee rates by category (FR 2024) ────────────────────────────────────
const EBAY_FEES: Record<EbayCategory, number> = {
  electronics: 0.087,   // 8.7%
  clothing:    0.1235,  // 12.35%
  other:       0.115,   // 11.5%
}

// ─── Verdict thresholds ───────────────────────────────────────────────────────
const MARGIN_THRESHOLD_GOOD = 15  // >= 15% → profitable
const MARGIN_THRESHOLD_LOW  = 0   // > 0% but < 15% → low margin

export function calculate(input: CalculatorInput): CalculatorResult {
  const { purchasePrice, sellingPrice, shippingCost, category } = input

  const ebayFeesPct = EBAY_FEES[category]
  const ebayFees    = sellingPrice * ebayFeesPct
  const netRevenue  = sellingPrice - ebayFees - shippingCost
  const netProfit   = netRevenue - purchasePrice
  const marginPct   = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0
  const roiPct      = purchasePrice > 0 ? (netProfit / purchasePrice) * 100 : 0

  const verdict =
    marginPct >= MARGIN_THRESHOLD_GOOD ? 'profitable' :
    marginPct >  MARGIN_THRESHOLD_LOW  ? 'low_margin' :
    'loss'

  return {
    ebayFees:    round(ebayFees),
    ebayFeesPct: ebayFeesPct * 100,
    netRevenue:  round(netRevenue),
    netProfit:   round(netProfit),
    marginPct:   round(marginPct),
    roiPct:      round(roiPct),
    verdict,
    isProfitable: verdict === 'profitable',
  }
}

function round(n: number, decimals = 2) {
  return Math.round(n * 10 ** decimals) / 10 ** decimals
}

// ─── Zod schema (used in Server Action + API route) ───────────────────────────
import { z } from 'zod'

export const calculatorSchema = z.object({
  productName:   z.string().max(100).optional(),
  purchasePrice: z.coerce.number().positive('Le prix d\'achat doit être positif'),
  sellingPrice:  z.coerce.number().positive('Le prix de vente doit être positif'),
  shippingCost:  z.coerce.number().min(0).default(0),
  category:      z.enum(['electronics', 'clothing', 'other']).default('other'),
})

export type CalculatorSchema = z.infer<typeof calculatorSchema>
