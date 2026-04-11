'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Calculator, History, Settings, LogOut, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

const NAV_ITEMS = [
  { href: '/app/calculator', label: 'Calculateur', icon: Calculator },
  { href: '/app/history',    label: 'Historique',  icon: History },
  { href: '/app/account',    label: 'Compte',       icon: Settings },
]

type Props = {
  user: User
  profile: Pick<Profile, 'plan' | 'daily_calc_count' | 'daily_reset_date'> | null
}

export default function AppNav({ user, profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isPro = profile?.plan === 'pro'
  const dailyUsed = profile?.daily_calc_count ?? 0
  const dailyMax = 3

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 border-r bg-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b">
        <Link href="/app/calculator" className="font-bold text-lg tracking-tight">
          ProfitSnap
        </Link>
        {isPro && (
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">PRO</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Freemium usage bar */}
      {!isPro && (
        <div className="px-4 py-3 mx-3 mb-3 bg-gray-50 rounded-lg border">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Calculs aujourd&apos;hui</span>
            <span>{dailyUsed}/{dailyMax}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min((dailyUsed / dailyMax) * 100, 100)}%` }}
            />
          </div>
          <Link
            href="/app/account"
            className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-medium hover:underline"
          >
            <Zap className="w-3 h-3" />
            Passer Pro — 19€/mois
          </Link>
        </div>
      )}

      {/* User + logout */}
      <div className="border-t px-3 py-3">
        <div className="text-xs text-gray-400 truncate px-2 mb-1">{user.email}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
