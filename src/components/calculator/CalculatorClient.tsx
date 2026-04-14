'use client'

import { useState, useTransition } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { calculateAndSave } from '@/app/app/calculator/actions'
import { calculate } from '@/lib/calculator'
import { formatCurrency, formatPct, cn } from '@/lib/utils'
import type { CalculatorResult, EbayCategory } from '@/types'
import UpsellModal from '@/components/calculator/UpsellModal'

const CATEGORIES: { value: EbayCategory; label: string; fees: string }[] = [
  { value: 'electronics', label: 'Électronique / Informatique', fees: '8.7%' },
  { value: 'clothing',    label: 'Mode / Vêtements',            fees: '12.35%' },
  { value: 'other',       label: 'Autres catégories',           fees: '11.5%' },
]

type Props = {
  plan: string
  dailyUsed: number
  isFirstVisit: boolean
}

const EMPTY_FORM = {
  productName:   '',
  purchasePrice: '',
  sellingPrice:  '',
  shippingCost:  '',
  category:      'other' as EbayCategory,
}

// Données d'exemple pré-remplies pour les nouveaux utilisateurs
const EXAMPLE_FORM = {
  productName:   'Nike Air Max 90',
  purchasePrice: '45',
  sellingPrice:  '75',
  shippingCost:  '6.99',
  category:      'clothing' as EbayCategory,
}

// Résultat exemple pré-calculé (source unique, calculé à la compilation)
const EXAMPLE_RESULT: CalculatorResult = calculate({
  purchasePrice: 45,
  sellingPrice:  75,
  shippingCost:  6.99,
  category:      'clothing',
})

export default function CalculatorClient({ plan, dailyUsed, isFirstVisit }: Props) {
  const [form, setForm]           = useState(isFirstVisit ? EXAMPLE_FORM : EMPTY_FORM)
  const [result, setResult]       = useState<CalculatorResult | null>(isFirstVisit ? EXAMPLE_RESULT : null)
  const [isExampleMode, setIsExampleMode] = useState(isFirstVisit)
  // Empêche de revenir à l'exemple après Effacer dans la même session
  const [hasLeftExample, setHasLeftExample] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Calcul live (client-side, instantané)
  function handleChange(field: string, value: string) {
    // Première frappe : sortir du mode exemple
    if (isExampleMode) {
      setIsExampleMode(false)
    }

    const next = { ...form, [field]: value }
    setForm(next)

    const pp = parseFloat(next.purchasePrice)
    const sp = parseFloat(next.sellingPrice)
    const sc = parseFloat(next.shippingCost) || 0

    if (pp > 0 && sp > 0) {
      setResult(calculate({
        purchasePrice: pp,
        sellingPrice:  sp,
        shippingCost:  sc,
        category:      next.category,
      }))
    } else {
      setResult(null)
    }
  }

  // Effacer : vide tout, ne revient jamais à l'exemple dans cette session
  function handleClear() {
    setForm(EMPTY_FORM)
    setResult(null)
    setIsExampleMode(false)
    setHasLeftExample(true)
  }

  // Sauvegarder via Server Action
  function handleSave() {
    if (!result || isExampleMode) return
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))

    startTransition(async () => {
      const res = await calculateAndSave(fd)
      if (!res.success) {
        if (res.error === 'LIMIT_REACHED') {
          setShowUpsell(true)
        } else {
          toast.error(res.error)
        }
        return
      }
      toast.success('Calcul sauvegardé ✓')
    })
  }

  const verdictConfig = {
    profitable: {
      icon:  TrendingUp,
      bg:    'bg-green-50 border-green-200',
      text:  'text-green-700',
      badge: 'bg-green-100 text-green-800',
      label: '✅ Rentable',
    },
    low_margin: {
      icon:  AlertTriangle,
      bg:    'bg-amber-50 border-amber-200',
      text:  'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
      label: '⚠️ Marge faible',
    },
    loss: {
      icon:  TrendingDown,
      bg:    'bg-red-50 border-red-200',
      text:  'text-red-700',
      badge: 'bg-red-100 text-red-800',
      label: '❌ Perte',
    },
  }

  const vc = result ? verdictConfig[result.verdict] : null
  const canSave = !!result && !isExampleMode && !isPending

  return (
    <>
      {/* ── Bandeau exemple ─────────────────────────────────────── */}
      {isExampleMode && (
        <div className="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <span className="text-base">💡</span>
          <span>
            <strong>Exemple pré-rempli</strong> — modifie les données pour commencer ton propre calcul.
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        {/* ── Formulaire ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Données du produit</h2>
            {/* Bouton Effacer — visible dès qu'un champ est rempli */}
            {(form.purchasePrice || form.sellingPrice || form.productName) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Effacer
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Nom du produit (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={e => handleChange('productName', e.target.value)}
                placeholder="Ex: Nike Air Max 90"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Prix */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix d&apos;achat (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={e => handleChange('purchasePrice', e.target.value)}
                  placeholder="0.00"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de vente eBay (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={e => handleChange('sellingPrice', e.target.value)}
                  placeholder="0.00"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de livraison (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.shippingCost}
                onChange={e => handleChange('shippingCost', e.target.value)}
                placeholder="0.00"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie eBay
              </label>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label} — {c.fees}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Frais finaux eBay estimés (grille tarifaire eBay FR 2024).{' '}
                <a
                  href="https://www.ebay.fr/help/selling/fees-credits-invoices/selling-fees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Voir les frais officiels
                </a>
              </p>
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            title={isExampleMode ? 'Modifie les données pour sauvegarder ton propre calcul' : undefined}
            className={cn(
              'mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors',
              canSave
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            {isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde…</>
              : <><Save className="w-4 h-4" /> Sauvegarder ce calcul</>
            }
          </button>

          {plan === 'free' && (
            <p className="text-center text-xs text-gray-400 mt-2">
              {3 - dailyUsed} calcul{3 - dailyUsed > 1 ? 's' : ''} gratuit{3 - dailyUsed > 1 ? 's' : ''} restant aujourd&apos;hui
            </p>
          )}
        </div>

        {/* ── Résultat ─────────────────────────────────────────────── */}
        <div>
          {result && vc ? (
            <div className={cn('rounded-2xl border p-6 shadow-sm transition-all', vc.bg)}>
              {/* Badge verdict + tag exemple */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold', vc.badge)}>
                  <vc.icon className="w-4 h-4" />
                  {vc.label}
                </div>
                {isExampleMode && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                    Exemple estimé
                  </span>
                )}
              </div>

              {/* Métrique principale */}
              <div className="mb-6">
                <p className={cn('text-4xl font-bold', vc.text)}>
                  {formatCurrency(result.netProfit)}
                </p>
                <p className="text-sm text-gray-500 mt-1">bénéfice net estimé par vente</p>
              </div>

              {/* Grille métriques */}
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Marge nette"   value={formatPct(result.marginPct)} />
                <Metric label="ROI"            value={formatPct(result.roiPct)} />
                <Metric label="Frais eBay"     value={formatCurrency(result.ebayFees)} sub={`${result.ebayFeesPct}%`} />
                <Metric label="Revenu net"     value={formatCurrency(result.netRevenue)} />
              </div>

              {/* Prix maximum conseillé — différenciateur principal */}
              <div className="mt-5 bg-white/70 rounded-xl px-4 py-3 border border-black/10">
                <p className="text-xs text-gray-500 mb-0.5">💡 Prix maximum d&apos;achat conseillé</p>
                {result.maxPurchasePrice > 0 ? (
                  <>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(result.maxPurchasePrice)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Pour atteindre au moins 15% de marge nette à ce prix de vente
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-600 font-medium mt-0.5">
                    Prix de vente insuffisant — non rentable à ce tarif eBay
                  </p>
                )}
              </div>

              {/* Détail */}
              <div className="mt-4 pt-4 border-t border-black/10 space-y-1.5 text-sm">
                <BreakdownRow label="Prix de vente"  value={`+ ${formatCurrency(parseFloat(form.sellingPrice))}`} />
                <BreakdownRow label="Frais eBay"     value={`- ${formatCurrency(result.ebayFees)}`} muted />
                <BreakdownRow label="Livraison"      value={`- ${formatCurrency(parseFloat(form.shippingCost) || 0)}`} muted />
                <BreakdownRow label="Prix d'achat"   value={`- ${formatCurrency(parseFloat(form.purchasePrice))}`} muted />
                <div className="pt-1.5 border-t border-black/10">
                  <BreakdownRow
                    label="Bénéfice net"
                    value={formatCurrency(result.netProfit)}
                    bold
                  />
                </div>
              </div>

              {/* Mention estimé */}
              <p className="mt-4 text-xs text-gray-400">
                Résultats estimés — les frais eBay réels peuvent varier selon votre compte.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white p-6 shadow-sm h-full flex items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-3">🧮</div>
                <p className="text-gray-500 text-sm">
                  Saisis un prix d&apos;achat et un prix de vente<br />pour voir le résultat en direct.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} />
    </>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/60 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

function BreakdownRow({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={cn('text-gray-600', bold && 'font-semibold text-gray-900')}>{label}</span>
      <span className={cn(muted ? 'text-gray-500' : 'font-medium text-gray-900', bold && 'font-semibold')}>{value}</span>
    </div>
  )
}
