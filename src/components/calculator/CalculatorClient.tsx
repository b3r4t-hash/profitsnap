'use client'

import { useState, useTransition } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Loader2, Save } from 'lucide-react'
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
}

const EMPTY_FORM = {
  productName:   '',
  purchasePrice: '',
  sellingPrice:  '',
  shippingCost:  '',
  category:      'other' as EbayCategory,
}

export default function CalculatorClient({ plan, dailyUsed }: Props) {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [result, setResult]   = useState<CalculatorResult | null>(null)
  const [showUpsell, setShowUpsell] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Live preview (client-side, instant)
  function handleChange(field: string, value: string) {
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

  // Save to DB via Server Action
  function handleSave() {
    if (!result) return
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

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        {/* ── Form ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Données du produit</h2>

          <div className="space-y-4">
            {/* Product name (optional) */}
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

            {/* Prices row */}
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

            {/* Shipping */}
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

            {/* Category */}
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

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!result || isPending}
            className={cn(
              'mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors',
              result
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

        {/* ── Result ───────────────────────────────────────────── */}
        <div>
          {result && vc ? (
            <div className={cn('rounded-2xl border p-6 shadow-sm transition-all', vc.bg)}>
              {/* Verdict badge */}
              <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-5', vc.badge)}>
                <vc.icon className="w-4 h-4" />
                {vc.label}
              </div>

              {/* Main metric */}
              <div className="mb-6">
                <p className={cn('text-4xl font-bold', vc.text)}>
                  {formatCurrency(result.netProfit)}
                </p>
                <p className="text-sm text-gray-500 mt-1">bénéfice net par vente</p>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Marge nette"   value={formatPct(result.marginPct)} />
                <Metric label="ROI"            value={formatPct(result.roiPct)} />
                <Metric label="Frais eBay"     value={formatCurrency(result.ebayFees)} sub={`${result.ebayFeesPct}%`} />
                <Metric label="Revenu net"     value={formatCurrency(result.netRevenue)} />
              </div>

              {/* Breakdown */}
              <div className="mt-5 pt-4 border-t border-black/10 space-y-1.5 text-sm">
                <BreakdownRow label="Prix de vente"      value={`+ ${formatCurrency(parseFloat(form.sellingPrice))}`} />
                <BreakdownRow label="Frais eBay"         value={`- ${formatCurrency(result.ebayFees)}`} muted />
                <BreakdownRow label="Livraison"          value={`- ${formatCurrency(parseFloat(form.shippingCost) || 0)}`} muted />
                <BreakdownRow label="Prix d'achat"       value={`- ${formatCurrency(parseFloat(form.purchasePrice))}`} muted />
                <div className="pt-1.5 border-t border-black/10">
                  <BreakdownRow
                    label="Bénéfice net"
                    value={formatCurrency(result.netProfit)}
                    bold
                  />
                </div>
              </div>
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
