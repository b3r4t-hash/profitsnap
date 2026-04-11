'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  plan: string
  hasCustomer: boolean
}

export default function StripeButtons({ plan, hasCustomer }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e: any) {
      toast.error(e.message ?? 'Erreur Stripe')
      setLoading(false)
    }
  }

  async function handlePortal() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e: any) {
      toast.error(e.message ?? 'Erreur Stripe')
      setLoading(false)
    }
  }

  if (plan === 'pro') {
    return (
      <button
        onClick={handlePortal}
        disabled={loading}
        className="flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Gérer mon abonnement
      </button>
    )
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Passer Pro — 19€/mois
    </button>
  )
}
