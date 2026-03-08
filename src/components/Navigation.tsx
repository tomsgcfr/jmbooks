'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'

export default function Navigation() {
    const { totalItems, setCartOpen } = useCart()

    return (
        <nav>
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src="/logo.png"
                        alt="Jeannette Musselman Logo"
                        width={120}
                        height={120}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>
            </div>
            <div>
                <button
                    className="cart-btn"
                    onClick={() => setCartOpen(true)}
                >
                    Cart ({totalItems})
                </button>
            </div>
        </nav>
    )
}
