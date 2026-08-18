'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleTrack(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_number', orderNumber.trim())
            .single();

        if (error || !data) {
            setError('Order not found. Please check your order number.');
        } else {
            setOrder(data);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#050a14] text-white p-6 md:p-12 flex flex-col items-center">
            <div className="max-w-xl w-full bg-gray-950 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    Track Your Order
                </h1>
                <p className="text-gray-400 text-sm mb-6">Enter your order reference code below to check live delivery status.</p>

                <form onSubmit={handleTrack} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="e.g. SW-10294"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
                    >
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>

                {error && <p className="text-red-400 text-sm bg-red-950/40 p-4 rounded-xl border border-red-900/50">{error}</p>}

                {order && (
                    <div className="bg-gray-900/60 border border-indigo-500/20 p-6 rounded-2xl space-y-4">
                        <div className="flex justify-between border-b border-gray-800 pb-3">
                            <span className="text-gray-400">Order Reference</span>
                            <span className="font-bold text-indigo-400">{order.order_number}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-3">
                            <span className="text-gray-400">Device</span>
                            <span className="font-semibold text-white">{order.device_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-3">
                            <span className="text-gray-400">Current Status</span>
                            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                {order.status}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Tracking Code</span>
                            <span className="font-mono text-gray-200">{order.tracking_number || 'Pending Dispatch'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}