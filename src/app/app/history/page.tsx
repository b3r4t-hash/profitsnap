import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency, formatPct } from '@/lib/utils'
import type { Calculation } from '@/types'

export const metadata = { title: 'Historique — ProfitSnap' }

export default async function HistoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  // Gate for free users
  if (profile?.plan !== 'pro') {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold">Historique Pro</h1>
        <p className="text-gray-500 mt-3 mb-8">
          L&apos;historique complet de tes calculs est réservé aux membres Pro.
        </p>
        <Link
          href="/app/account"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          Passer Pro — 19€/mois
        </Link>
      </div>
    )
  }

  const { data: calculations } = await supabase
    .from('calculations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
          <p className="text-gray-500 text-sm mt-1">{calculations?.length ?? 0} calculs sauvegardés</p>
        </div>
        {/* TODO: CSV export button */}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {!calculations?.length ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">Aucun calcul pour l&apos;instant</p>
            <Link href="/app/calculator" className="text-green-600 text-sm hover:underline">
              Faire mon premier calcul →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Achat</th>
                <th className="px-4 py-3">Vente</th>
                <th className="px-4 py-3">Profit</th>
                <th className="px-4 py-3">Marge</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {calculations.map((c: Calculation) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">
                    {c.product_name ?? <span className="text-gray-400 italic">Sans nom</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(c.purchase_price)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCurrency(c.selling_price)}</td>
                  <td className={`px-4 py-3 font-medium ${c.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(c.net_profit)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatPct(c.margin_pct)}</td>
                  <td className="px-4 py-3">
                    <VerdictBadge verdict={c.verdict} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    profitable: 'bg-green-100 text-green-700',
    low_margin: 'bg-amber-100 text-amber-700',
    loss:       'bg-red-100 text-red-700',
  }
  const labels: Record<string, string> = {
    profitable: 'Rentable',
    low_margin: 'Faible',
    loss:       'Perte',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[verdict] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[verdict] ?? verdict}
    </span>
  )
}
