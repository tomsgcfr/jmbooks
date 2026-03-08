'use client'

import { useCart } from './CartContext'
import Link from 'next/link'
import Image from 'next/image'
import styles from './CartSidebar.module.css'

export default function CartSidebar() {
    const { isCartOpen, setCartOpen, items, updateQuantity, removeFromCart, totalAmount } = useCart()

    if (!isCartOpen) return null

    return (
        <>
            <div className={styles.overlay} onClick={() => setCartOpen(false)} />
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h2>Your Cart</h2>
                    <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>&times;</button>
                </div>

                <div className={styles.items}>
                    {items.length === 0 ? (
                        <p className={styles.emptyMsg}>Your cart is empty.</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className={styles.item}>
                                {item.imageUrl && (
                                    <div className={styles.imgContainer}>
                                        <Image src={item.imageUrl} alt={item.title} fill className={styles.image} />
                                    </div>
                                )}
                                <div className={styles.details}>
                                    <h4>{item.title}</h4>
                                    <p className={styles.price}>${item.price.toFixed(2)}</p>
                                    <div className={styles.actions}>
                                        <div className={styles.quantity}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
