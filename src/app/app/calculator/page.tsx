import { createClient } from '@/lib/supabase/server'
import CalculatorClient from '@/components/calculator/CalculatorClient'

export const metadata = {
  title: 'Calculateur — ProfitSnap',
}

export default async function CalculatorPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, daily_calc_count, daily_reset_date')
    .eq('id', user!.id)
    .single()

  const today = new Date().toISOString().slice(0, 10)
  const isNewDay = profile?.daily_reset_date !== today
  const dailyUsed = isNewDay ? 0 : (profile?.daily_calc_count ?? 0)

  // Source de vérité pour l'exemple pré-rempli : 0 calcul sauvegardé = première visite
  const { count } = await supabase
    .from('calculations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const isFirstVisit = (count ?? 0) === 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calculateur de rentabilité</h1>
        <p className="text-gray-500 text-sm mt-1">
          Saisis les données du produit — le résultat apparaît instantanément.
        </p>
      </div>
      <CalculatorClient
        plan={profile?.plan ?? 'free'}
        dailyUsed={dailyUsed}
        isFirstVisit={isFirstVisit}
      />
    </div>
  )
}
