'use client'

import { useState } from 'react'
import Link from 'next/link'
import { changePassword } from '../login/actions'
import styles from './settings.module.css'

export default function SettingsPage() {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setMessage('')
        setError('')
        const result = await changePassword(formData)
        if (result.error) {
            setError(result.error)
        } else if (result.success) {
            setMessage('Password changed successfully!')
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Settings</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2>Change Password</h2>

                    {message && <p className={styles.success}>{message}</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <form action={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input type="password" name="currentPassword" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input type="password" name="newPassword" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmPassword" required />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Change Password
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
