'use server'

import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { put, del } from '@vercel/blob'
import { writeFile } from 'fs/promises'
import path from 'path'

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function saveFile(file: File, subdir: string): Promise<string> {
    const ext = path.extname(file.name)
    const safeName = slugify(file.name.replace(ext, '')) + '-' + Date.now() + ext

    // Use Vercel Blob in production, local filesystem in dev
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`${subdir}/${safeName}`, file, { access: 'public' })
        return blob.url
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(process.cwd(), 'public', subdir, safeName)
    await writeFile(filePath, buffer)
    return `/${subdir}/${safeName}`
}

export async function createBook(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File | null
    const pdfFile = formData.get('pdf') as File | null

    if (!title || !description) return

    let imageUrl: string | undefined
    let pdfUrl: string | undefined

    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFile(imageFile, 'books')
    }

    if (pdfFile && pdfFile.size > 0) {
        pdfUrl = await saveFile(pdfFile, 'pdfs')
    }

    await prisma.product.create({
        data: { title, description, imageUrl, pdfUrl },
    })

    revalidatePath('/admin/books')
    revalidatePath('/')
    revalidatePath('/books')
    redirect('/admin/books')
}

export async function updateBook(formData: FormData) {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File | null
    const pdfFile = formData.get('pdf') as File | null

    if (!id || !title || !description) return

    const data: Record<string, string> = { title, description }

    if (imageFile && imageFile.size > 0) {
        data.imageUrl = await saveFile(imageFile, 'books')
    }

    if (pdfFile && pdfFile.size > 0) {
        data.pdfUrl = await saveFile(pdfFile, 'pdfs')
    }

    await prisma.product.update({ where: { id }, data })

    revalidatePath('/admin/books')
    revalidatePath('/')
    revalidatePath('/books')
    revalidatePath(`/books/${id}`)
    redirect('/admin/books')
}

export async function deleteBook(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return

    const book = await prisma.product.findUnique({ where: { id } })
    if (!book) return

    // Delete associated comments first
    await prisma.comment.deleteMany({ where: { bookId: id } })

    // Delete blob files if using Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        if (book.imageUrl?.startsWith('http')) await del(book.imageUrl).catch(() => {})
        if (book.pdfUrl?.startsWith('http')) await del(book.pdfUrl).catch(() => {})
    }

    await prisma.product.delete({ where: { id } })

    revalidatePath('/admin/books')
    revalidatePath('/')
    revalidatePath('/books')
    redirect('/admin/books')
}
