'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { resetPassword } from '../login/actions'
import styles from '../login/login.module.css'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError('')
        formData.set('token', token || '')
        const res = await resetPassword(formData)
        if (res?.success) {
            setSuccess(true)
        } else if (res?.error) {
            setError(res.error)
        }
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Invalid Link</h1>
                    <p>This password reset link is invalid. Please request a new one from the login page.</p>
                    <a href="/admin/login" className={styles.button} style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
                        Back to Login
                    </a>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Password Reset</h1>
                    <p>Your password has been reset successfully.</p>
                    <a href="/admin/login" className={styles.button} style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
                        Go to Login
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Reset Password</h1>
                <p>Enter your new password below.</p>

                <form action={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        required
                        minLength={6}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        required
                        minLength={6}
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.button}>
                        Reset Password
                    </button>
                </form>
                <a href="/admin/login" className={styles.forgotLink} style={{ display: 'inline-block', marginTop: '0.75rem' }}>
                    Back to Login
                </a>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    )
}
