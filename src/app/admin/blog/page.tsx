import Link from 'next/link'
import { prisma } from '../../../lib/prisma'
import { logout } from '../login/actions'
import { deleteBlogPost, togglePublish } from './actions'
import styles from './blog.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Manage Blog</h1>
                </div>
                <form action={logout}>
                    <button className={styles.logoutButton}>Log Out</button>
                </form>
            </header>

            <main className={styles.main}>
                <Link href="/admin/blog/new" className={styles.addButton}>
                    + Create New Post
                </Link>

                {posts.length === 0 ? (
                    <p className={styles.empty}>No blog posts yet. Create your first one!</p>
                ) : (
                    <div className={styles.list}>
                        {posts.map((post) => (
                            <div key={post.id} className={styles.card}>
                                <div className={styles.cardContent}>
                                    <div>
                                        <h2>{post.title}</h2>
                                        <p className={styles.meta}>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`${styles.status} ${post.published ? styles.published : styles.draft}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className={styles.cardActions}>
                                    <Link href={`/admin/blog/${post.id}/edit`} className={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <form action={togglePublish} style={{ display: 'inline' }}>
                                        <input type="hidden" name="id" value={post.id} />
                                        <input type="hidden" name="published" value={String(post.published)} />
                                        <button type="submit" className={styles.toggleBtn}>
                                            {post.published ? 'Unpublish' : 'Publish'}
                                        </button>
                                    </form>
                                    <form action={deleteBlogPost} style={{ display: 'inline' }}>
                                        <input type="hidden" name="id" value={post.id} />
                                        <button type="submit" className={styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
