'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// Replace with your actual admin email address
const ADMIN_EMAIL = 'antony_pee.exe@Tenthra.none'; // Update if needed

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        checkAdminAccess();
    }, []);

    async function checkAdminAccess() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== ADMIN_EMAIL) {
            alert('Access denied: Admins only.');
            router.push('/dashboard'); // Kick non-admins back to normal dashboard
            return;
        }

        // Fetch orders and inventory data concurrently
        await fetchData();
        setLoading(false);
    }

    async function fetchData() {
        // Fetch orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersData) setOrders(ordersData);

        // Fetch inventory / devices (assuming you have a 'devices' or 'inventory' table)
        const { data: inventoryData } = await supabase
            .from('devices')
            .select('*');

        if (inventoryData) setInventory(inventoryData);
    }

    async function updateOrderStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            fetchData();
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-[#050a14] text-white p-12">Verifying Admin Privileges...</div>;
    }

    const processingOrders = orders.filter(o => o.status === 'Processing');

    return (
        <div className="min-h-screen bg-[#050a14] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                            Scriptwave Admin Command Center
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Logged in as Administrator: <span className="text-indigo-400">{ADMIN_EMAIL}</span></p>
                    </div>
                    <button
                        onClick={() => { supabase.auth.signOut(); router.push('/login'); }}
                        className="px-4 py-2 bg-red-950/60 border border-red-900/50 text-red-300 hover:bg-red-900/60 rounded-xl text-sm transition"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-950 border border-indigo-500/30 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Total Orders</h3>
                        <p className="text-3xl font-black text-indigo-400">{orders.length}</p>
                    </div>
                    <div className="bg-gray-950 border border-indigo-500/30 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Orders Processing</h3>
                        <p className="text-3xl font-black text-yellow-400">{processingOrders.length}</p>
                    </div>
                    <div className="bg-gray-950 border border-indigo-500/30 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-gray-400 text-sm mb-1">Inventory Items</h3>
                        <p className="text-3xl font-black text-emerald-400">{inventory.length}</p>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                    <h2 className="text-xl font-bold mb-4">Customer Orders & Processing Status</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-sm bg-gray-900/40">
                                <th className="p-3">Order #</th>
                                <th className="p-3">Customer Email</th>
                                <th className="p-3">Device</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900 text-sm">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-900/30">
                                    <td className="p-3 font-mono font-bold text-indigo-400">{order.order_number}</td>
                                    <td className="p-3 text-gray-300">{order.customer_email}</td>
                                    <td className="p-3 text-white">{order.device_name}</td>
                                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/30">
                        {order.status}
                      </span>
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'Processing')}
                                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition"
                                        >
                                            Processing
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'Shipped')}
                                            className="px-2.5 py-1 bg-blue-600/80 hover:bg-blue-600 rounded text-xs transition"
                                        >
                                            Shipped
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                            className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-600 rounded text-xs transition"
                                        >
                                            Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">No orders logged.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Section */}
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                    <h2 className="text-xl font-bold mb-4">Device Inventory Stock</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {inventory.map((item) => (
                            <div key={item.id} className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl">
                                <h3 className="font-semibold text-white">{item.name || item.device_name}</h3>
                                <p className="text-indigo-400 text-sm font-bold mt-1">R {item.price}</p>
                                <p className="text-gray-400 text-xs mt-2">Stock status: <span className="text-emerald-400">Available</span></p>
                            </div>
                        ))}
                        {inventory.length === 0 && (
                            <p className="text-gray-500 text-sm">No inventory records found in the database.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}