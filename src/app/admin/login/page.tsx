'use client'

import { useState } from 'react'
import { login } from './actions'
import styles from './login.module.css'

export default function LoginPage() {
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        const res = await login(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Jeannette&apos;s Bookshop Admin</h1>
                <p>Please enter your password to edit books.</p>

                <form action={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.button}>
                        Log In
                    </button>
                </form>
            </div>
        </div>
    )
}
