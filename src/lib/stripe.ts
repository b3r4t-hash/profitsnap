import Stripe from 'stripe'

// Singleton — instantiated once at module load
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    dailyLimit: 3,
    features: ['3 calculs par jour', 'Résultat immédiat'],
  },
  pro: {
    name: 'Pro',
    price: 19,
    dailyLimit: Infinity,
    features: [
      'Calculs illimités',
      'Historique complet',
      'Export CSV',
      'Paramètres TVA personnalisés',
    ],
  },
} as const
