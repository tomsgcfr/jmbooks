import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './detail.module.css'
import { prisma } from '../../../lib/prisma'
import CommentSection from '../../../components/CommentSection'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params
    const product = await prisma.product.findUnique({ where: { id: params.id } })
    if (!product) return { title: "Book Not Found" }
    return {
        title: product.title,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.slice(0, 160),
            type: "book",
            ...(product.imageUrl ? { images: [{ url: product.imageUrl, alt: product.title }] } : {}),
        },
        alternates: { canonical: `/books/${params.id}` },
    }
}

export default async function BookDetail(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    })

    if (!product) {
        notFound()
    }

    const comments = await prisma.comment.findMany({
        where: { bookId: product.id, approved: true, parentId: null },
        include: {
            replies: {
                where: { approved: true },
                orderBy: { createdAt: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: product.title,
        description: product.description,
        author: { '@type': 'Person', name: 'Jeannette Musselman' },
        ...(product.imageUrl ? { image: product.imageUrl } : {}),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    }

    return (
        <main className={styles.detailContainer}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Link href="/books" className={styles.backLink}>&larr; Back to Books</Link>

            <div className={styles.grid}>
                <div className={styles.imageColumn}>
                    {product.imageUrl && (
                        <div className={styles.bookWrapper}>
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className={styles.coverImage}
                                priority
                            />
                        </div>
                    )}
                </div>

                <div className={styles.infoColumn}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <p className={styles.freeLabel}>Free Download</p>

                    <div className={styles.description}>
                        <p>{product.description}</p>
                    </div>

                    {product.pdfUrl && (
                        <div className={styles.actions}>
                            <a href={`/api/download/${product.id}`} className="btn-download">
                                Download PDF
                            </a>
                        </div>
                    )}

                    <p className={styles.downloadCount}>
                        {product.downloadCount} {product.downloadCount === 1 ? 'download' : 'downloads'}
                    </p>
                </div>
            </div>

            <CommentSection bookId={product.id} comments={comments} />
        </main>
    )
}
