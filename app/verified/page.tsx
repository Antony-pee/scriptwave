'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function VerifiedPage() {
    const [status, setStatus] = useState('Verifying your account...')

    useEffect(() => {
        async function handleVerification() {
            // Supabase automatically parses tokens in the URL hash on client side
            const { data, error } = await supabase.auth.getSession()

            if (error || !data.session) {
                // Alternatively check if there's an exchange code in query params
                const hash = window.location.hash
                if (hash && hash.includes('access_token')) {
                    setStatus('Account successfully verified!')
                } else {
                    setStatus('Verification link processed or session active.')
                }
            } else {
                setStatus('Account successfully verified!')
            }
        }

        handleVerification()
    }, [])

    return (
        <div className="min-h-screen bg-[#050a14] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-gray-950 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-4">
                <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/40 rounded-full flex items-center justify-center mx-auto text-indigo-400 text-2xl font-bold">
                    ✓
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    {status}
                </h1>
                <p className="text-gray-400 text-sm">
                    You are verified! You can now close this tab and return to the application.
                </p>
            </div>
        </div>
    )
}