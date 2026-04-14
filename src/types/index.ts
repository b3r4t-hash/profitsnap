// ─── Database types (simplified — generate full version with: supabase gen types) ───

export type Plan = 'free' | 'pro'

export type Profile = {
  id: string
  email: string
  plan: Plan
  daily_calc_count: number
  daily_reset_date: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export type Calculation = {
  id: string
  user_id: string
  product_name: string | null
  purchase_price: number
  selling_price: number
  shipping_cost: number
  ebay_fees_pct: number
  net_profit: number
  margin_pct: number
  roi_pct: number
  is_profitable: boolean
  verdict: 'profitable' | 'low_margin' | 'loss'
  created_at: string
}

// ─── Calculator types ─────────────────────────────────────────────────────────

export type EbayCategory =
  | 'electronics'
  | 'clothing'
  | 'other'

export type CalculatorInput = {
  productName?: string
  purchasePrice: number
  sellingPrice: number
  shippingCost: number
  category: EbayCategory
}

export type CalculatorResult = {
  ebayFees: number
  ebayFeesPct: number
  netRevenue: number
  netProfit: number
  marginPct: number
  roiPct: number
  verdict: 'profitable' | 'low_margin' | 'loss'
  isProfitable: boolean
  // Prix maximum d'achat pour atteindre au moins 15% de marge
  maxPurchasePrice: number
}
