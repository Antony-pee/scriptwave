'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            fetchOrders(); // Refresh list
        }
    }

    if (loading) return <div className="p-8 text-white">Loading admin backend...</div>;

    return (
        <div className="min-h-screen bg-[#050a14] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    Backend Admin: Order Management
                </h1>

                <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm bg-gray-900/50">
                            <th className="p-4">Order #</th>
                            <th className="p-4">Customer Email</th>
                            <th className="p-4">Device</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900 text-sm">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-900/40">
                                <td className="p-4 font-mono font-bold text-indigo-400">{order.order_number}</td>
                                <td className="p-4 text-gray-300">{order.customer_email}</td>
                                <td className="p-4 text-white font-medium">{order.device_name}</td>
                                <td className="p-4">
                    <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30">
                      {order.status}
                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() => updateStatus(order.id, 'Processing')}
                                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition"
                                    >
                                        Processing
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order.id, 'Shipped')}
                                        className="px-3 py-1 bg-blue-600/80 hover:bg-blue-600 rounded text-xs transition"
                                    >
                                        Mark Shipped
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order.id, 'Delivered')}
                                        className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 rounded text-xs transition"
                                    >
                                        Mark Delivered
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">No orders found in the database.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}