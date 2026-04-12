import { z } from 'zod'

/**
 * Supabase Auth Helpers — French error translation + validation
 * Safe to use in both client and server components
 */

// ─── French Error Message Translation ────────────────────────────────────────
export function translateAuthError(error: Error | null | undefined): string {
  if (!error) return ''

  const message = error.message?.toLowerCase() || ''

  if (message.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect'
  }

  if (message.includes('email not confirmed')) {
    return 'Vérifie ton email avant de te connecter'
  }

  if (message.includes('user already registered')) {
    return 'Cet email est déjà enregistré. Essaie de te connecter.'
  }

  if (message.includes('password too short')) {
    return 'Le mot de passe doit faire au moins 8 caractères'
  }

  if (message.includes('invalid email')) {
    return 'Adresse email invalide'
  }

  if (message.includes('network') || message.includes('failed')) {
    return 'Erreur réseau. Vérifie ta connexion internet'
  }

  if (message.includes('provider')) {
    return "Erreur avec le fournisseur OAuth. Réessaie ou utilise une autre méthode"
  }

  if (message.includes('rate limit')) {
    return 'Trop de tentatives. Attends quelques minutes et réessaie'
  }

  if (message.includes('session')) {
    return 'Votre session a expiré. Reconnectez-vous'
  }

  return 'Une erreur est survenue. Réessaie ou contacte le support'
}

// ─── Email Validation ────────────────────────────────────────────────────────
const emailSchema = z
  .string({ required_error: 'Email requis' })
  .min(1, 'Email requis')
  .email('Email invalide')
  .max(254, 'Email trop long')

export function validateEmail(email: string): string | null {
  const result = emailSchema.safeParse(email)
  if (result.success) return null
  return result.error.errors[0]?.message || 'Email invalide'
}

// ─── Password Validation & Strength ──────────────────────────────────────────
export interface PasswordStrength {
  isValid: boolean
  score: 'weak' | 'fair' | 'good' | 'strong'
  errors: string[]
  message: string
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Au moins 8 caractères requis')
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password)

  let strengthPoints = 0
  if (password.length >= 8) strengthPoints++
  if (password.length >= 12) strengthPoints++
  if (hasUppercase && hasLowercase) strengthPoints++
  if (hasNumbers) strengthPoints++
  if (hasSpecial) strengthPoints++

  let score: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  if (strengthPoints <= 1) score = 'weak'
  else if (strengthPoints === 2) score = 'fair'
  else if (strengthPoints === 3 || strengthPoints === 4) score = 'good'
  else score = 'strong'

  let message = ''
  if (score === 'weak') message = 'Mot de passe trop faible'
  else if (score === 'fair') message = 'Mot de passe correct'
  else if (score === 'good') message = 'Bon mot de passe'
  else message = 'Très bon mot de passe'

  return {
    isValid: errors.length === 0,
    score,
    errors,
    message,
  }
}

export function getPasswordRequirements(): string[] {
  return [
    'Au moins 8 caractères',
    'Un mélange de majuscules et minuscules (recommandé)',
    'Chiffres et caractères spéciaux (recommandé)',
  ]
}

// ─── Combined Validation Schema ──────────────────────────────────────────────
export const authCredentialsSchema = z.object({
  email: emailSchema,
  password: z
    .string({ required_error: 'Mot de passe requis' })
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .max(128, 'Mot de passe trop long'),
})

export type AuthCredentials = z.infer<typeof authCredentialsSchema>

export function validateAuthForm(
  email: string,
  password: string
): { success: boolean; errors: Record<string, string> } {
  const result = authCredentialsSchema.safeParse({ email, password })

  if (result.success) {
    return { success: true, errors: {} }
  }

  const errors: Record<string, string> = {}

  result.error.errors.forEach((err) => {
    const field = String(err.path[0] || '')
    if (field && !errors[field]) {
      errors[field] = err.message
    }
  })

  return { success: false, errors }
}

// ─── Auth State Helper ───────────────────────────────────────────────────────
export function getAuthErrorFromUrl(searchParams: URLSearchParams): string | null {
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')

  if (!error && !errorCode) return null

  if (errorCode === 'otp_expired') {
    return 'Le code de vérification a expiré. Réessaie'
  }

  if (error === 'access_denied') {
    return 'Accès refusé'
  }

  if (error === 'server_error') {
    return 'Erreur serveur. Réessaie dans quelques instants'
  }

  return "Une erreur d'authentification est survenue"
}