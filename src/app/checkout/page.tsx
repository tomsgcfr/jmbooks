'use client'

import { useState } from 'react'
import { submitOrder } from './actions'
import { useCart } from '../../components/CartContext'
import styles from './checkout.module.css'

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart()
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    if (items.length === 0 && status !== 'success') {
        return (
            <main className={styles.container}>
                <h1>Checkout</h1>
                <p>Your cart is empty. Please add items before checking out.</p>
            </main>
        )
    }

    if (status === 'success') {
        return (
            <main className={styles.container}>
                <div className={styles.successCard}>
                    <h1>Order Placed Successfully!</h1>
                    <p>
                        An email confirming your order and providing instructions for E-Transfer
                        has been sent to you.
                    </p>
                    <p>
                        Please check your inbox (and spam folder) to complete your payment.
                        Jeannette will ship your books as soon as the E-Transfer is received!
                    </p>
                </div>
            </main>
        )
    }

    const SHIPPING_COST = 10.00 // Flat rate Canada
    const finalTotal = totalAmount + SHIPPING_COST

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('submitting')
        setErrorMsg('')

        const formData = new FormData(e.currentTarget)
        formData.append('items', JSON.stringify(items))
        formData.append('totalAmount', finalTotal.toString())

        const res = await submitOrder(formData)

        if (res?.error) {
            setErrorMsg(res.error)
            setStatus('error')
        } else {
            clearCart()
            setStatus('success')
        }
    }

    return (
        <main className={styles.container}>
            <h1>Checkout</h1>

            <div className={styles.grid}>
                <div className={styles.formSection}>
                    <h2>Shipping Information</h2>
                    <p className={styles.note}>Note: We currently only ship within Canada via flat rate ($10).</p>

                    <form id="checkout-form" onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input type="text" name="customerName" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input type="email" name="customerEmail" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Street Address</label>
                            <input type="text" name="address" required />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input type="text" name="city" required />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Province</label>
                                <select name="province" required>
                                    <option value="">Select...</option>
                                    <option value="AB">Alberta</option>
                                    <option value="BC">British Columbia</option>
                                    <option value="MB">Manitoba</option>
                                    <option value="NB">New Brunswick</option>
                                    <option value="NL">Newfoundland and Labrador</option>
                                    <option value="NS">Nova Scotia</option>
                                    <option value="ON">Ontario</option>
                                    <option value="PE">Prince Edward Island</option>
                                    <option value="QC">Quebec</option>
                                    <option value="SK">Saskatchewan</option>
                                    <option value="NT">Northwest Territories</option>
                                    <option value="NU">Nunavut</option>
                                    <option value="YT">Yukon</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Postal Code</label>
                                <input type="text" name="postalCode" required />
                            </div>
                        </div>

                        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                    </form>
                </div>

                <div className={styles.summarySection}>
                    <h2>Order Summary</h2>
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.summaryItem}>
                                <div className={styles.itemTitle}>
                                    {item.title} <span className={styles.itemQty}>x{item.quantity}</span>
                                </div>
                                <div className={styles.itemPrice}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Flat Rate Shipping</span>
                            <span>${SHIPPING_COST.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                            <span>Total to Pay</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        className={`btn-primary ${styles.submitBtn}`}
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'Processing...' : 'Place Order via E-Transfer'}
                    </button>

                    <p className={styles.guarantee}>
                        By clicking &quot;Place Order&quot;, you will receive an email with instructions
                        on how to securely send an Interac E-Transfer to Jeannette.
                    </p>
                </div>
            </div>
        </main>
    )
}
