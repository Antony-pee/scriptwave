'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setMessage('');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // This tells Supabase where to redirect the user after they click the email link
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            setMessage('Error: ' + error.message);
        } else {
            setMessage('Success! Check your email inbox to verify your account.');
        }
    }

    return (
        <div className="p-8 max-w-md mx-auto text-white">
            <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
            {message && <p className="mb-4 text-indigo-400">{message}</p>}

            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 p-2 rounded text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 p-2 rounded text-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}