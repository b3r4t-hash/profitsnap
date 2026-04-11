import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StripeButtons from '@/components/layout/StripeButtons'

export const metadata = { title: 'Mon compte — ProfitSnap' }

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id, stripe_subscription_id, created_at')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Abonnement</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">
              Plan {profile?.plan === 'pro' ? 'Pro' : 'Gratuit'}
            </p>
            <p className="text-sm text-gray-500">
              {profile?.plan === 'pro'
                ? '19€/mois · Calculs illimités'
                : '3 calculs gratuits par jour'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            profile?.plan === 'pro'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {profile?.plan === 'pro' ? 'Pro' : 'Free'}
          </span>
        </div>

        <div className="mt-5 pt-5 border-t">
          <StripeButtons
            plan={profile?.plan ?? 'free'}
            hasCustomer={!!profile?.stripe_customer_id}
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <h2 className="font-semibold text-red-700 mb-2">Zone de danger</h2>
        <p className="text-sm text-gray-500 mb-4">
          La suppression de ton compte est définitive et irréversible.
        </p>
        <button className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
