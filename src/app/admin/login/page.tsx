'use client'

import { useState } from 'react'
import { login, forgotPassword } from './actions'
import styles from './login.module.css'

export default function LoginPage() {
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [sendingReset, setSendingReset] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError('')
        setMessage('')
        const res = await login(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    async function handleForgotPassword() {
        setError('')
        setMessage('')
        setSendingReset(true)
        const res = await forgotPassword()
        setSendingReset(false)
        if (res?.success) {
            setMessage('A password reset link has been sent to your email.')
        } else if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Jeannette&apos;s Admin</h1>
                <p>Please enter your password to manage your website.</p>

                <form action={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    {message && <p className={styles.success}>{message}</p>}
                    <button type="submit" className={styles.button}>
                        Log In
                    </button>
                </form>
                <button
                    onClick={handleForgotPassword}
                    disabled={sendingReset}
                    className={styles.forgotLink}
                >
                    {sendingReset ? 'Sending...' : 'Forgot Password?'}
                </button>
            </div>
        </div>
    )
}
