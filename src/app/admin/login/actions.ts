'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const password = formData.get('password')

    // Hardcoded for extreme simplicity for the 80yo author
    if (password === 'jeannette2026') {
        const cookieStore = await cookies()
        cookieStore.set('admin_auth', 'jeannette2026', { secure: true, httpOnly: true, path: '/' })
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
