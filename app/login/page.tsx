'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg('Login error: ' + error.message);
        } else {
            // Check if the logged-in email is your admin email
            if (email.trim().toLowerCase() === 'antony_pee.exe@Tenthra.none'.toLowerCase()) {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard'); // Regular customers go here
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#050a14] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-gray-950 border border-gray-800 p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-6">Log In to Scriptwave</h1>

                {errorMsg && <p className="text-red-400 text-sm mb-4 bg-red-950/40 p-3 rounded-lg border border-red-900">{errorMsg}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}