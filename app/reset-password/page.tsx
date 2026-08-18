'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleReset(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match. Please re-type.')
            return
        }

        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setErrorMsg('Error updating password: ' + error.message)
            setLoading(false)
        } else {
            setSuccess(true)
        }
    }

    return (
        <div className="min-h-screen bg-[#050a14] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-gray-950 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
                {!success ? (
                    <>
                        <h1 className="text-2xl font-black mb-2 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                            Reset Your Password
                        </h1>
                        <p className="text-gray-400 text-sm mb-6">Enter your new password below twice to confirm.</p>

                        {errorMsg && (
                            <div className="mb-4 bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-red-300 text-sm text-left">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleReset} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? 'Updating Database...' : 'Update Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">
                            ✓
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                            Thank you! Password updated successfully.
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Your information has been saved in the database. You can now close this tab.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}