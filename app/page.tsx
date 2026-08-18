'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorMsg('')

    if (isSignUp) {
      // Sign Up with Email and Password (triggers Supabase email verification link)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setMessage('Verification link sent! Please check your email inbox to verify your account before logging in.')
      }
    } else {
      // Sign In with Email and Password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        // Admin routing check
        if (email.trim().toLowerCase() === 'antony_pee.exe@Tenthra.none'.toLowerCase()) {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    }
    setLoading(false)
  }

  return (
      <div className="min-h-screen bg-[#050a14] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-950 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Scriptwave.tech
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {isSignUp ? 'Create your new account' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {errorMsg && (
              <div className="mb-4 bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-red-300 text-sm">
                {errorMsg}
              </div>
          )}

          {message && (
              <div className="mb-4 bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-emerald-300 text-sm">
                {message}
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 text-sm"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account & Send Verification' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
                onClick={() => { setIsSignUp(!isSignUp); setMessage(''); setErrorMsg(''); }}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
  )
}