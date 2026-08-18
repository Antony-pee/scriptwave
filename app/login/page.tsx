'use client'

import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    // Handle Email/Password Signup
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setErrorMsg(error.message)
        else alert('Check your email for the confirmation link!')
        setLoading(false)
    }

    // Handle Email/Password Signin
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setErrorMsg(error.message)
        } else {
            router.push('/dashboard')
        }
        setLoading(false)
    }

    // Handle Google OAuth Signin
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })
        if (error) setErrorMsg(error.message)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center">Welcome to Scriptwave</h1>

                {errorMsg && <div className="p-3 text-sm bg-red-500 text-white rounded">{errorMsg}</div>}

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                    Sign in with Google
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="px-3 text-gray-400 text-sm">or email</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-1/2 py-3 bg-indigo-600 font-semibold rounded-lg hover:bg-indigo-500 transition"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-1/2 py-3 bg-gray-700 font-semibold rounded-lg hover:bg-gray-600 transition border border-gray-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}