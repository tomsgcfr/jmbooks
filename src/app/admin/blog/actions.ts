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

async function saveImage(file: File): Promise<string> {
    const ext = path.extname(file.name)
    const safeName = slugify(file.name.replace(ext, '')) + '-' + Date.now() + ext

    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`blog/${safeName}`, file, { access: 'public' })
        return blob.url
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const dir = path.join(process.cwd(), 'public', 'blog')
    const { mkdir } = await import('fs/promises')
    await mkdir(dir, { recursive: true })
    const filePath = path.join(dir, safeName)
    await writeFile(filePath, buffer)
    return `/blog/${safeName}`
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string | null
    const published = formData.get('published') === 'on'
    const imageFile = formData.get('image') as File | null

    if (!title || !content) return

    let slug = slugify(title)
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) slug = slug + '-' + Date.now()

    let imageUrl: string | undefined
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveImage(imageFile)
    }

    await prisma.blogPost.create({
        data: {
            title,
            slug,
            content,
            excerpt: excerpt || undefined,
            imageUrl,
            published,
        },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath('/')
    redirect('/admin/blog')
}

export async function updateBlogPost(formData: FormData) {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string | null
    const published = formData.get('published') === 'on'
    const imageFile = formData.get('image') as File | null

    if (!id || !title || !content) return

    const data: Record<string, unknown> = { title, content, excerpt: excerpt || null, published }

    if (imageFile && imageFile.size > 0) {
        data.imageUrl = await saveImage(imageFile)
    }

    await prisma.blogPost.update({ where: { id }, data })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath('/')
    redirect('/admin/blog')
}

export async function deleteBlogPost(formData: FormData) {
    const id = formData.get('id') as string
    if (!id) return

    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return

    await prisma.comment.deleteMany({ where: { blogPostId: id } })

    if (process.env.BLOB_READ_WRITE_TOKEN && post.imageUrl?.startsWith('http')) {
        await del(post.imageUrl).catch(() => {})
    }

    await prisma.blogPost.delete({ where: { id } })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath('/')
    redirect('/admin/blog')
}

export async function togglePublish(formData: FormData) {
    const id = formData.get('id') as string
    const currentlyPublished = formData.get('published') === 'true'
    if (!id) return

    await prisma.blogPost.update({
        where: { id },
        data: { published: !currentlyPublished },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    revalidatePath('/')
}
