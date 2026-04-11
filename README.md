# ProfitSnap — Profit Calculator for eBay Resellers

> MVP micro-SaaS | Next.js 14 · Supabase · Stripe · Vercel

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase + Stripe keys
```

### 3. Set up the database
1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor → paste and run `supabase/migrations/001_initial.sql`
3. Enable Google OAuth (optional) in Authentication → Providers

### 4. Configure Stripe
1. Create a product "ProfitSnap Pro" at 19€/month in Stripe Dashboard
2. Copy the Price ID → `STRIPE_PRO_PRICE_ID` in `.env.local`
3. Run the Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook secret → STRIPE_WEBHOOK_SECRET
```

### 5. Run locally
```bash
npm run dev
# → http://localhost:3000
```

### 6. Deploy to Vercel
```bash
vercel deploy
# Add all env vars in Vercel Dashboard → Settings → Environment Variables
# Add production webhook in Stripe Dashboard → Webhooks → Add endpoint
# Endpoint: https://your-domain.vercel.app/api/stripe/webhook
# Events to listen: customer.subscription.created/updated/deleted
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/page.tsx        # Login
│   │   └── register/page.tsx     # Registration
│   ├── app/                      # Authenticated routes
│   │   ├── layout.tsx            # App shell (sidebar)
│   │   ├── calculator/
│   │   │   ├── page.tsx          # Calculator page (server)
│   │   │   └── actions.ts        # Server Action: calculate + save
│   │   ├── history/page.tsx      # Calculation history (Pro)
│   │   └── account/page.tsx      # Account + Stripe
│   ├── api/stripe/
│   │   ├── checkout/route.ts     # Create checkout session
│   │   ├── portal/route.ts       # Customer portal
│   │   └── webhook/route.ts      # Handle Stripe events
│   └── auth/callback/route.ts    # OAuth callback
├── components/
│   ├── calculator/
│   │   ├── CalculatorClient.tsx  # Interactive calculator UI
│   │   └── UpsellModal.tsx       # Free limit reached modal
│   └── layout/
│       ├── AppNav.tsx            # Sidebar navigation
│       └── StripeButtons.tsx     # Checkout/portal buttons
├── lib/
│   ├── calculator.ts             # Business logic + Zod schema
│   ├── stripe.ts                 # Stripe singleton + plan config
│   ├── utils.ts                  # cn(), formatCurrency(), formatPct()
│   └── supabase/
│       ├── client.ts             # Browser client
│       ├── server.ts             # Server client + admin client
│       └── middleware.ts         # Session refresh + route protection
├── types/index.ts                # TypeScript types
└── middleware.ts                 # Next.js middleware
```

## Key Design Decisions

- **Live preview** — calculation runs client-side instantly on every keystroke
- **Save on demand** — DB write only when user clicks "Save" (reduces DB writes)
- **Freemium gate** — enforced server-side in Server Action (can't be bypassed)
- **Stripe webhook** — single source of truth for plan status updates
- **RLS** — users can only access their own data (enforced at DB level)
