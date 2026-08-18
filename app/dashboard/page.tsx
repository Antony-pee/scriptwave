'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function Dashboard() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
            }
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen relative flex bg-[#050a14]">
            {/* Background Image Container with Fixed Attachment & Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0 pointer-events-none"
                style={{ backgroundImage: "url('/dashboard-bg.png')" }}
            />

            {/* Dark Overlay to Guarantee Text Readability over the Pixel Art */}
            <div className="absolute inset-0 bg-[#050a14]/75 z-0 pointer-events-none" />

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 p-6 md:p-10 text-white max-w-7xl mx-auto">

                {/* Dashboard Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800/60 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
                        </h1>
                        <p className="text-indigo-200 text-sm md:text-base mt-1">
                            Here is the current operational snapshot for your scripts and devices.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
              ● System Online
            </span>
                    </div>
                </header>

                {/* Dashboard Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* WIDGET 1: Active Devices */}
                    <div className="bg-gray-950/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/80 shadow-2xl transition hover:border-indigo-500/40">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Inventory</h2>
                        <p className="text-5xl font-bold text-indigo-400">5</p>
                        <p className="text-gray-400 text-sm mt-2">Hardware items listed and ready in store.</p>
                    </div>

                    {/* WIDGET 2: Profile Status Card */}
                    <div className="bg-gray-950/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/80 shadow-2xl transition hover:border-indigo-500/40">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Profile</h2>
                        <p className="text-lg font-bold text-white truncate">{profile?.first_name} {profile?.last_name || 'User'}</p>
                        <p className="text-gray-400 text-sm truncate mt-1">{profile?.email || 'Loading email...'}</p>
                        <div className="mt-4">
                            <a href="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline">
                                Manage Profile Settings →
                            </a>
                        </div>
                    </div>

                    {/* WIDGET 3: Quick Navigation / Actions */}
                    <div className="bg-gray-950/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/80 shadow-2xl transition hover:border-indigo-500/40">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Navigation</h2>
                        <div className="flex flex-col space-y-2">
                            <a href="/devices" className="text-sm text-gray-300 hover:text-white bg-gray-900/80 hover:bg-indigo-950/60 p-2.5 rounded-lg border border-gray-800 transition flex items-center justify-between">
                                <span>Browse Devices</span>
                                <span>→</span>
                            </a>
                            <a href="/cart" className="text-sm text-gray-300 hover:text-white bg-gray-900/80 hover:bg-indigo-950/60 p-2.5 rounded-lg border border-gray-800 transition flex items-center justify-between">
                                <span>Cart & Checkout</span>
                                <span>→</span>
                            </a>
                        </div>
                    </div>

                    {/* WIDGET 4: Recent Lounge / Activity Stream (Span 2 Columns) */}
                    <div className="bg-gray-950/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/80 shadow-2xl lg:col-span-2">
                        <h2 className="text-lg font-semibold text-white mb-4">System Broadcasts & Logs</h2>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="p-3 rounded-lg bg-gray-900/40 border border-gray-800/60 flex items-start space-x-3">
                                <span className="text-indigo-400 font-bold">INFO</span>
                                <p>Quantum Processor X1 inventory initialized and synced successfully.</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-900/40 border border-gray-800/60 flex items-start space-x-3">
                                <span className="text-green-400 font-bold">SYNC</span>
                                <p>Supabase user profile triggers active. Database records operating smoothly.</p>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 5: Quick Actions Bar */}
                    <div className="bg-gray-950/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/80 shadow-2xl flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">Workspace Controls</h2>
                            <p className="text-gray-400 text-sm mb-4">Jump straight into managing your deployment pipeline.</p>
                        </div>
                        <div className="space-y-2">
                            <a href="/devices" className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition shadow-lg">
                                View Store Inventory
                            </a>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}