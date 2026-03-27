'use client'

import { useState } from 'react'
import { subscribe } from '../lib/actions/subscribe'
import styles from './Footer.module.css'

export default function SubscribeForm() {
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(formData: FormData) {
        setMessage('')
        const res = await subscribe(formData)
        if (res?.success) {
            setSubmitted(true)
            setIsError(false)
            setMessage('Thank you for subscribing!')
        } else if (res?.error) {
            setIsError(true)
            setMessage(res.error)
        }
    }

    if (submitted) {
        return <p className={styles.successMsg}>{message}</p>
    }

    return (
        <>
            <form action={handleSubmit} className={styles.subscribeForm}>
                <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className={styles.subscribeInput}
                />
                <button type="submit" className={styles.subscribeButton}>
                    Subscribe
                </button>
            </form>
            {message && (
                <p className={isError ? styles.errorMsg : styles.successMsg}>
                    {message}
                </p>
            )}
        </>
    )
}
