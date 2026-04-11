import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Required: disable Next.js body parsing for webhook signature verification
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body      = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    // ── Subscription created / reactivated ─────────────────────
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id

      if (!userId) break

      const isActive = sub.status === 'active' || sub.status === 'trialing'
      await supabase
        .from('profiles')
        .update({
          plan: isActive ? 'pro' : 'free',
          stripe_subscription_id: sub.id,
        })
        .eq('id', userId)
      break
    }

    // ── Subscription cancelled / expired ───────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id

      if (!userId) break

      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', userId)
      break
    }

    default:
      // Ignore other events
      break
  }

  return NextResponse.json({ received: true })
}
