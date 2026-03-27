'use client'

import { deleteBook } from './actions'
import styles from './books.module.css'

export default function DeleteBookButton({ bookId }: { bookId: string }) {
    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this book?')) return
        const formData = new FormData()
        formData.set('id', bookId)
        await deleteBook(formData)
    }

    return (
        <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete
        </button>
    )
}
