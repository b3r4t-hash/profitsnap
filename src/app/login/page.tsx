```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  translateAuthError,
  validateAuthForm
} from '@/lib/supabase/auth'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()

  // ─── Clear field-level error when user starts typing ───────────────────────
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }))
    }
  }

  // ─── Validate form before submission ──────────────────────────────────────
  const validateForm = (): boolean => {
    const validation = validateAuthForm(email, password)
    
    if (!validation.success) {
      setFieldErrors(validation.errors)
      // Show first error in toast
      const firstError = Object.values(validation.errors)[0]
      if (firstError) {
        toast.error(firstError)
      }
      return false
    }
    
    setFieldErrors({})
    return true
  }

  // ─── Handle email/password login ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    
    // Validate form first
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      })
      
      if (error) {
        // Translate Supabase error to French
        const friendlyError = translateAuthError(error)
        setFieldErrors({ form: friendlyError })
        toast.error(friendlyError)
      } else {
        // Success — redirect to app
        toast.success('Connexion réussie !')
        router.push('/app/calculator')
        router.refresh()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      const friendlyError = translateAuthError(new Error(errorMessage))
      setFieldErrors({ form: friendlyError })
      toast.error(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  // ─── Handle Google OAuth ─────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true)
    
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth/callback` },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur OAuth'
      toast.error(translateAuthError(new Error(errorMessage)))
      setLoading(false)
    }
  }

  // ─── Check if form is valid for submit button state ────────────────────────
  const isFormValid = email.trim() !== '' && password !== ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border p-8 shadow-sm">
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold">ProfitSnap</Link>
          <p className="text-gray-500 text-sm mt-2">Connecte-toi à ton compte</p>
        </div>

        {/* ─── Form-level error (network, rate limit, etc.) ──────────────── */}
        {fieldErrors.form && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{fieldErrors.form}</p>
          </div>
        )}

        {/* ─── Google OAuth Button ────────────────────────────────────────── */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        {/* ─── Divider ─────────────────────────────────────────────────���──── */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"/></div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">ou</div>
        </div>

        {/* ─── Email/Password Form ────────────────────────────────────────── */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email
                  ? 'border-red-300 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="toi@exemple.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
              disabled={loading}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? 'border-red-300 bg-red-50 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion…
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* ─── Sign up link ───────────────────────────────────────────────── */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link 
            href="/register" 
            className="text-green-600 font-medium hover:underline"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
```