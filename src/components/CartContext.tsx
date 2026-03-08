'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
    id: string
    title: string
    price: number
    imageUrl: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isCartOpen: boolean
    setCartOpen: (isOpen: boolean) => void
    totalAmount: number
    totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setCartOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
        const saved = localStorage.getItem('jeannette-cart')
        if (saved) {
            try { setItems(JSON.parse(saved)) } catch { }
        }
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('jeannette-cart', JSON.stringify(items))
        }
    }, [items, isMounted])

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems(current => {
            const existing = current.find(item => item.id === product.id)
            if (existing) {
                return current.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...current, { ...product, quantity: 1 }]
        })
        setCartOpen(true)
    }

    const removeFromCart = (id: string) => {
        setItems(current => current.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id)
            return
        }
        setItems(current => current.map(item =>
            item.id === id ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => setItems([])

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            isCartOpen, setCartOpen, totalAmount, totalItems
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
