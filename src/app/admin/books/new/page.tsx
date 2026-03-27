import Link from 'next/link'
import { createBook } from '../actions'
import styles from '../books.module.css'

export default function NewBookPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/books" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Add New Book</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <form action={createBook} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" name="title" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea name="description" rows={5} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Book Cover Image</label>
                            <input type="file" name="image" accept="image/*" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>PDF File</label>
                            <input type="file" name="pdf" accept=".pdf" />
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Save Book
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
