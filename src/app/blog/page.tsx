import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './blog.module.css'
import { prisma } from '../../lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "Blog",
    description: "Thoughts, teachings, and reflections by Jeannette Musselman on grace, faith, and the New Covenant.",
    alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <h1>Blog</h1>
                <p>Thoughts, teachings, and reflections by Jeannette Musselman</p>
            </div>

            {posts.length === 0 ? (
                <div className={styles.empty}>
                    <p>No blog posts yet. Check back soon!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                            {post.imageUrl && (
                                <div className={styles.imageContainer}>
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                </div>
                            )}
                            <div className={styles.cardContent}>
                                <time className={styles.date}>
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </time>
                                <h2>{post.title}</h2>
                                {post.excerpt && <p>{post.excerpt}</p>}
                                <span className={styles.readMore}>Read More &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}
