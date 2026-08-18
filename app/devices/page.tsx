'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    title: string
    description: string
    price: number
    stock_quantity: number
}

export default function DevicesPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase.from('products').select('*')
            if (error) {
                console.error('Error fetching products:', error.message)
            } else {
                setProducts(data || [])
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const addToCart = async (productId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert('Please sign in first!')
            router.push('/login')
            return
        }

        const { error } = await supabase
            .from('cart_items')
            .upsert({ user_id: user.id, product_id: productId, quantity: 1 }, { onConflict: 'user_id,product_id' })

        if (error) {
            alert('Error adding to cart: ' + error.message)
        } else {
            alert('Device added to cart successfully!')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar Menu */}
            <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-gray-700">
                <div>
                    <h2 className="text-xl font-bold mb-8 text-indigo-400">Scriptwave.tech</h2>
                    <nav className="space-y-4">
                        <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">Dashboard</a>
                        <a href="/devices" className="block py-2 px-4 rounded bg-indigo-600 font-semibold">Devices Available</a>
                        <a href="/cart" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">Cart & Checkout</a>
                        <a href="/lounge" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">Community Lounge</a>
                        <a href="/faq" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">FAQ</a>
                    </nav>
                </div>
                <button
                    onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition"
                >
                    Sign Out
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Available Electronic Devices</h1>

                {loading ? (
                    <p className="text-gray-400">Loading devices...</p>
                ) : products.length === 0 ? (
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-400 mb-2">No devices found in your Supabase database yet.</p>
                        <p className="text-sm text-gray-500">Add a row to your `products` table in Supabase to see them appear here!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-indigo-400 mb-4">${product.price.toFixed(2)}</div>
                                    <button
                                        onClick={() => addToCart(product.id)}
                                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}