'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createBlogPost } from '../actions'
import styles from '../blog.module.css'

export default function NewBlogPostPage() {
    const [content, setContent] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(formData: FormData) {
        formData.set('content', content)
        await createBlogPost(formData)
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/blog" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Create New Post</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <form ref={formRef} action={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" name="title" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Short Summary (optional)</label>
                            <textarea name="excerpt" rows={2} placeholder="A brief summary shown on the blog listing..." />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Featured Image (optional)</label>
                            <input type="file" name="image" accept="image/*" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Content</label>
                            <RichTextEditor content="" onChange={setContent} />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <input type="checkbox" name="published" id="published" />
                            <label htmlFor="published">Publish now (visible to readers)</label>
                        </div>

                        <button type="submit" className={styles.saveButton}>
                            Save Post
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
