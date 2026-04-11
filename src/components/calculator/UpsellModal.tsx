'use client'

import { useState } from 'react'
import { X, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  open: boolean
  onClose: () => void
}

export default function UpsellModal({ open, onClose }: Props) {
  const router = useRouter()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Tu as atteint ta limite gratuite
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Tu peux faire 3 calculs gratuits par jour. Passe en Pro pour des calculs illimités, l&apos;historique complet et l&apos;export CSV.
          </p>

          <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left space-y-2">
            {['Calculs illimités', 'Historique complet', 'Export CSV', 'Paramètres TVA personnalisés'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span> {f}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/app/account')}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Passer Pro — 19€/mois
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Continuer gratuitement (demain)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
