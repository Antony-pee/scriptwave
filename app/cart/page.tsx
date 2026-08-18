'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

interface CartItem {
    id: string
    quantity: number
    products: {
        id: string
        title: string
        price: number
    } | null
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [shippingFee, setShippingFee] = useState(30)
    const router = useRouter()

    useEffect(() => {
        async function fetchCart() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('cart_items')
                .select(`
                    id,
                    quantity,
                    products ( id, title, price )
                `)
                .eq('user_id', user.id)

            if (error) {
                console.error('Error fetching cart:', error.message)
            } else {
                // Map data safely handling Supabase relation arrays if returned as an array
                const formattedItems: CartItem[] = (data || []).map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity,
                    products: Array.isArray(item.products) ? item.products[0] || null : item.products
                }))
                setCartItems(formattedItems)
            }
            setLoading(false)
        }
        fetchCart()
    }, [router])

    const subtotal = cartItems.reduce((acc, item) => acc + (item.products?.price || 0) * item.quantity, 0)
    const totalAmount = subtotal + shippingFee

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const orderNumber = 'SW-' + Math.floor(100000 + Math.random() * 900000)
        const shippingAddress = { street, city, state, country, postalCode }
        const deviceSummary = cartItems.map(item => `${item.quantity}x ${item.products?.title || 'Item'}`).join(', ')

        const { error } = await supabase.from('orders').insert({
            order_number: orderNumber,
            user_id: user.id,
            customer_email: user.email,
            device_name: deviceSummary || 'Scriptwave Hardware Bundle',
            total_amount: totalAmount,
            shipping_fee: shippingFee,
            shipping_address: shippingAddress,
            status: 'Processing'
        })

        if (error) {
            alert('Checkout error: ' + error.message)
        } else {
            alert(`Order placed successfully! Your Order Number is ${orderNumber}`)
            await supabase.from('cart_items').delete().eq('user_id', user.id)
            setCartItems([])
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-gray-700">
                <div>
                    <h2 className="text-xl font-bold mb-8 text-indigo-400">Scriptwave.tech</h2>
                    <nav className="space-y-4">
                        <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">Dashboard</a>
                        <a href="/devices" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300">Devices Available</a>
                        <a href="/cart" className="block py-2 px-4 rounded bg-indigo-600 font-semibold">Cart & Checkout</a>
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
                <h1 className="text-3xl font-bold mb-6">Shopping Cart & Checkout</h1>

                {loading ? (
                    <p className="text-gray-400">Loading cart...</p>
                ) : cartItems.length === 0 ? (
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-400 mb-2">Your cart is empty.</p>
                        <a href="/devices" className="text-indigo-400 underline font-medium">Browse devices</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cart Summary */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                                    <div>
                                        <h4 className="font-medium text-white">{item.products?.title || 'Product'}</h4>
                                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold text-indigo-400">${((item.products?.price || 0) * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                            <div className="pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-300"><span>Shipping Fee</span><span>${shippingFee.toFixed(2)}</span></div>
                                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-700"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handleCheckout} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address & Payment</h2>
                            <div>
                                <label className="block text-sm text-gray-300">Street Address</label>
                                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="123 Main St" className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300">City</label>
                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City" className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300">State / Province</label>
                                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} required placeholder="State" className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-300">Country</label>
                                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="Country" className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300">Postal Code</label>
                                    <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="Postal Code" className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-300">Card Details (Simulated Gateway)</label>
                                <input type="text" placeholder="4242 •••• •••• ••••" required className="w-full mt-1 p-3 bg-gray-700 rounded-lg text-white border border-gray-600" />
                            </div>

                            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition">
                                Complete Payment & Place Order
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}