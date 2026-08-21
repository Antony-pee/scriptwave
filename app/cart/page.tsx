'use client'

import React, { useState } from 'react'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: '1', name: 'Sample Item 1', price: 250, quantity: 1 },
        { id: '2', name: 'Sample Item 2', price: 450, quantity: 2 },
    ])

    const updateQuantity = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta
                    return newQty > 0 ? { ...item, quantity: newQty } : item
                }
                return item
            })
        )
    }

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-white">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-gray-900 p-4 border border-gray-800"
                            >
                                <div>
                                    <h2 className="font-semibold">{item.name}</h2>
                                    <p className="text-sm text-gray-400">
                                        R{item.price.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 rounded bg-gray-800 px-2 py-1">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-2 text-gray-400 hover:text-white"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-2 text-gray-400 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 border-t border-gray-800 pt-4 text-right">
                            <p className="text-xl font-bold">
                                Total: R{subtotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}