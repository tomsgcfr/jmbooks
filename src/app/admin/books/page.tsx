import Link from 'next/link'
import { prisma } from '../../../lib/prisma'
import { logout } from '../login/actions'
import DeleteBookButton from './DeleteBookButton'
import styles from './books.module.css'

export default async function AdminBooksPage() {
    const books = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' },
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Manage Books</h1>
                </div>
                <form action={logout}>
                    <button className={styles.logoutButton}>Log Out</button>
                </form>
            </header>

            <main className={styles.main}>
                <Link href="/admin/books/new" className={styles.addButton}>
                    + Add New Book
                </Link>

                <div className={styles.list}>
                    {books.map((book) => (
                        <div key={book.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                {book.imageUrl && (
                                    <img src={book.imageUrl} alt="" className={styles.thumb} />
                                )}
                                <div className={styles.cardText}>
                                    <h2>{book.title}</h2>
                                    <p className={styles.downloads}>
                                        {book.downloadCount} downloads
                                    </p>
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <Link href={`/admin/books/${book.id}/edit`} className={styles.editBtn}>
                                    Edit
                                </Link>
                                <DeleteBookButton bookId={book.id} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
