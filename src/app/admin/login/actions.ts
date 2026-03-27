'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { prisma } from '../../../lib/prisma'

const SESSION_TOKEN = 'admin_authenticated'

export async function login(formData: FormData) {
    const password = formData.get('password') as string

    const setting = await prisma.adminSetting.findUnique({
        where: { key: 'admin_password' },
    })

    if (setting && password === setting.value) {
        const cookieStore = await cookies()
        cookieStore.set('admin_auth', SESSION_TOKEN, { secure: true, httpOnly: true, path: '/' })
        redirect('/admin')
    } else {
        return { error: 'Incorrect password' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_auth')
    redirect('/admin/login')
}

export async function changePassword(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'All fields are required.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match.' }
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters.' }
    }

    const setting = await prisma.adminSetting.findUnique({
        where: { key: 'admin_password' },
    })

    if (!setting || currentPassword !== setting.value) {
        return { error: 'Current password is incorrect.' }
    }

    await prisma.adminSetting.update({
        where: { key: 'admin_password' },
        data: { value: newPassword },
    })

    return { success: true }
}

const ADMIN_EMAIL = 'jimandnet.m@gmail.com'

export async function forgotPassword() {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
        data: { token, expiresAt },
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/admin/reset-password?token=${token}`

    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
        await resend.emails.send({
            from: 'JM Books <noreply@jmbooks.online>',
            to: ADMIN_EMAIL,
            subject: 'Password Reset - Admin Dashboard',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Password Reset Request</h2>
                    <p>You requested a password reset for your admin dashboard.</p>
                    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #5c8d89; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
                    <p style="color: #999; font-size: 0.85rem; margin-top: 2rem;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        })
        return { success: true }
    } catch {
        return { error: 'Failed to send reset email. Please try again later.' }
    }
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!token || !newPassword || !confirmPassword) {
        return { error: 'All fields are required.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Passwords do not match.' }
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters.' }
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    })

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
        return { error: 'Invalid or expired reset link. Please request a new one.' }
    }

    await prisma.adminSetting.update({
        where: { key: 'admin_password' },
        data: { value: newPassword },
    })

    await prisma.passwordResetToken.update({
        where: { token },
        data: { used: true },
    })

    return { success: true }
}
