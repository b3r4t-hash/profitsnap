import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProfitSnap — Calculateur de rentabilité eBay',
  description:
    'Calculez instantanément votre marge réelle sur eBay. Stop aux mauvaises décisions d\'achat.',
  openGraph: {
    title: 'ProfitSnap',
    description: 'Le calculateur de rentabilité pour revendeurs eBay',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
