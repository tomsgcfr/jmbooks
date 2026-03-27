import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '../../../../../lib/prisma'
import { updateBook } from '../../actions'
import styles from '../../books.module.css'

export default async function EditBookPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const book = await prisma.product.findUnique({
        where: { id: params.id },
    })

    if (!book) notFound()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/books" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Edit Book</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <form action={updateBook} className={styles.form}>
                        <input type="hidden" name="id" value={book.id} />

                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={book.title} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea name="description" defaultValue={book.description} rows={5} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Book Cover Image</label>
                            {book.imageUrl && (
                                <p className={styles.currentFile}>Current: {book.imageUrl}</p>
                            )}
                            <input type="file" name="image" accept="image/*" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>PDF File</label>
                            {book.pdfUrl && (
                                <p className={styles.currentFile}>Current: {book.pdfUrl}</p>
                            )}
                            <input type="file" name="pdf" accept=".pdf" />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Save Changes
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
