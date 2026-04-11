import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/layout/AppNav'

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
      <main className="flex-1 min-w-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
