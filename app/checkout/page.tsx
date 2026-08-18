'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        checkUserSession();
    }, []);

    async function checkUserSession() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // If the user is not logged in, redirect them to the sign-up/login page
            router.push('/signup'); // Or /login depending on your route
        } else {
            setUser(user);
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="p-8 text-white">Verifying account security...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-4">Secure Checkout</h1>
            <p className="text-gray-400 mb-6">Logged in as: <span className="text-indigo-400">{user?.email}</span></p>

            {/* Your Cart Summary and Payment Form Goes Here */}
            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <p className="text-gray-400 mb-6">No scam, certified authentic hardware ready for dispatch.</p>

                <button
                    onClick={() => alert('Order placed successfully!')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
                >
                    Complete Order
                </button>
            </div>
        </div>
    );
}