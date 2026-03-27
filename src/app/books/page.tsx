import Image from 'next/image'
import Link from 'next/link'
import styles from '../page.module.css'
import { prisma } from '../../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
    const books = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
    })

    return (
        <main className={styles.main} style={{ paddingTop: '2rem' }}>
            <div className={styles.sectionHeader}>
                <h1>All Books</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>All books are free to download</p>
            </div>

            <div className={styles.bookGrid}>
                {books.map((book) => (
                    <div key={book.id} className={styles.bookCard}>
                        <Link href={`/books/${book.id}`} className={styles.bookImageContainer}>
                            {book.imageUrl && (
                                <div className={styles.book3d}>
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        fill
                                        className={styles.bookCover}
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                    <div className={styles.bookSpine}></div>
                                </div>
                            )}
                        </Link>
                        <div className={styles.bookInfo}>
                            <Link href={`/books/${book.id}`}><h3>{book.title}</h3></Link>
                            <p className={styles.freeLabel}>Free Download</p>
                            <Link href={`/books/${book.id}`} className={styles.viewBookBtn}>
                                View Book
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
