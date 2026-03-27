'use server'

import { prisma } from '../prisma'

export async function subscribe(formData: FormData) {
    const email = (formData.get('email') as string)?.trim()
    const honeypot = formData.get('website') as string

    if (honeypot) {
        return { success: true }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Please enter a valid email address.' }
    }

    try {
        await prisma.subscriber.create({ data: { email } })
        return { success: true }
    } catch (e: unknown) {
        if (
            typeof e === 'object' && e !== null && 'code' in e &&
            (e as { code: string }).code === 'P2002'
        ) {
            return { error: 'This email is already subscribed.' }
        }
        return { error: 'Something went wrong. Please try again.' }
    }
}
