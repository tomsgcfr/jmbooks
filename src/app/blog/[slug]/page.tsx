import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './post.module.css'
import { prisma } from '../../../lib/prisma'
import CommentSection from '../../../components/CommentSection'
import ShareButtons from '../../../components/ShareButtons'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params
    const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } })
    if (!post) return { title: "Post Not Found" }
    const description = post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 160)
    return {
        title: post.title,
        description,
        openGraph: {
            title: post.title,
            description,
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            authors: ["Jeannette Musselman"],
            ...(post.imageUrl ? { images: [{ url: post.imageUrl, alt: post.title }] } : {}),
        },
        twitter: {
            card: post.imageUrl ? "summary_large_image" : "summary",
            title: post.title,
            description,
        },
        alternates: { canonical: `/blog/${params.slug}` },
    }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug, published: true },
    })

    if (!post) {
        notFound()
    }

    const comments = await prisma.comment.findMany({
        where: { blogPostId: post.id, approved: true, parentId: null },
        include: {
            replies: {
                where: { approved: true },
                orderBy: { createdAt: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    const description = post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 160)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: { '@type': 'Person', name: 'Jeannette Musselman' },
        publisher: { '@type': 'Organization', name: 'Jeannette Musselman Books', logo: { '@type': 'ImageObject', url: 'https://jmbooks.online/logo.png' } },
        ...(post.imageUrl ? { image: post.imageUrl } : {}),
    }

    return (
        <main className={styles.container}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Link href="/blog" className={styles.backLink}>&larr; Back to Blog</Link>

            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <time className={styles.date}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </time>
                    <h1>{post.title}</h1>
                </header>

                {post.imageUrl && (
                    <div className={styles.featuredImage}>
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className={styles.image}
                            priority
                        />
                    </div>
                )}

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            <ShareButtons title={post.title} />

            <CommentSection blogPostId={post.id} comments={comments} />
        </main>
    )
}
