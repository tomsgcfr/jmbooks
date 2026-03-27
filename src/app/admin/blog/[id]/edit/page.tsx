'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import RichTextEditor from '../../../../../components/RichTextEditor'
import { updateBlogPost } from '../../actions'
import styles from '../../blog.module.css'

export default function EditBlogPostPage(props: { params: Promise<{ id: string }> }) {
    const [post, setPost] = useState<{
        id: string; title: string; content: string; excerpt: string | null;
        imageUrl: string | null; published: boolean
    } | null>(null)
    const [content, setContent] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        async function load() {
            const params = await props.params
            const res = await fetch(`/api/admin/blog/${params.id}`)
            const data = await res.json()
            setPost(data)
            setContent(data.content)
        }
        load()
    }, [props.params])

    async function handleSubmit(formData: FormData) {
        formData.set('content', content)
        await updateBlogPost(formData)
    }

    if (!post) return <div className={styles.container}><main className={styles.main}><p>Loading...</p></main></div>

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/blog" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Edit Post</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <form ref={formRef} action={handleSubmit} className={styles.form}>
                        <input type="hidden" name="id" value={post.id} />

                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" name="title" defaultValue={post.title} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Short Summary (optional)</label>
                            <textarea name="excerpt" rows={2} defaultValue={post.excerpt || ''} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Featured Image (optional)</label>
                            {post.imageUrl && <p style={{ color: '#777', fontSize: '0.9rem' }}>Current: {post.imageUrl}</p>}
                            <input type="file" name="image" accept="image/*" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Content</label>
                            <RichTextEditor content={post.content} onChange={setContent} />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <input type="checkbox" name="published" id="published" defaultChecked={post.published} />
                            <label htmlFor="published">Published (visible to readers)</label>
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
