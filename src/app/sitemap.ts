import type { MetadataRoute } from 'next'
import { prisma } from '../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const BASE_URL = 'https://jmbooks.online'

    const books = await prisma.product.findMany({ select: { id: true, updatedAt: true } })
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    })

    return [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/books`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        ...books.map((book) => ({
            url: `${BASE_URL}/books/${book.id}`,
            lastModified: book.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        ...posts.map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ]
}
