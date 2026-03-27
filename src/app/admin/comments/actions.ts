'use server'

import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function approveComment(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return

    await prisma.comment.update({
        where: { id },
        data: { approved: true },
    })

    revalidatePath('/admin/comments')
    revalidatePath('/books')
    revalidatePath('/blog')
}

export async function deleteComment(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return

    // Delete any replies first
    await prisma.comment.deleteMany({ where: { parentId: id } })
    await prisma.comment.delete({ where: { id } })

    revalidatePath('/admin/comments')
    revalidatePath('/books')
    revalidatePath('/blog')
}

export async function adminReply(formData: FormData) {
    const parentId = formData.get('parentId') as string
    const content = formData.get('content') as string
    const bookId = formData.get('bookId') as string | null
    const blogPostId = formData.get('blogPostId') as string | null

    if (!parentId || !content) return

    await prisma.comment.create({
        data: {
            name: 'Jeannette Musselman',
            email: 'jimandnet.m@gmail.com',
            content,
            approved: true,
            parentId,
            bookId: bookId || undefined,
            blogPostId: blogPostId || undefined,
        },
    })

    revalidatePath('/admin/comments')
    revalidatePath('/books')
    revalidatePath('/blog')
}
