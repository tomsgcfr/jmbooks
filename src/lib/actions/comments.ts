'use server'

import { prisma } from '../prisma'
import { revalidatePath } from 'next/cache'

export async function submitComment(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const content = formData.get('content') as string
    const bookId = formData.get('bookId') as string | null
    const blogPostId = formData.get('blogPostId') as string | null
    const parentId = formData.get('parentId') as string | null
    const honeypot = formData.get('website') as string

    // Honeypot spam check
    if (honeypot) {
        return { success: true }
    }

    if (!name || !email || !content) {
        return { error: 'All fields are required.' }
    }

    if (!bookId && !blogPostId) {
        return { error: 'Invalid comment target.' }
    }

    await prisma.comment.create({
        data: {
            name,
            email,
            content,
            bookId: bookId || undefined,
            blogPostId: blogPostId || undefined,
            parentId: parentId || undefined,
            approved: false,
        },
    })

    if (bookId) revalidatePath(`/books/${bookId}`)
    if (blogPostId) revalidatePath(`/blog`)

    return { success: true }
}
