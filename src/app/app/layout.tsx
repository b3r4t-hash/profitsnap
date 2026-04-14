import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/layout/AppNav'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile for plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, daily_calc_count, daily_reset_date')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AppNav user={user} profile={profile} />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
        {/* Footer app — légal minimal */}
        <footer className="px-6 md:px-8 py-4 border-t bg-white">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <Link href="/cgu" className="hover:text-gray-600 transition-colors">CGU</Link>
            <Link href="/confidentialite" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
            <a
              href="https://www.ebay.fr/help/selling/fees-credits-invoices/selling-fees"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Frais eBay ↗
            </a>
            <span className="ml-auto">Résultats estimés — non garantis · © 2026 ProfitSnap</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
