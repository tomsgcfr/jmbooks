import Link from 'next/link'
import { prisma } from '../../../lib/prisma'
import { logout } from '../login/actions'
import { approveComment, deleteComment, adminReply } from './actions'
import styles from './comments.module.css'

export default async function AdminCommentsPage() {
    const pendingComments = await prisma.comment.findMany({
        where: { approved: false },
        include: { book: true, blogPost: true },
        orderBy: { createdAt: 'desc' },
    })

    const approvedComments = await prisma.comment.findMany({
        where: { approved: true, parentId: null },
        include: {
            book: true,
            blogPost: true,
            replies: {
                where: { approved: true },
                orderBy: { createdAt: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Manage Comments</h1>
                </div>
                <form action={logout}>
                    <button className={styles.logoutButton}>Log Out</button>
                </form>
            </header>

            <main className={styles.main}>
                {/* Pending Section */}
                <section>
                    <h2 className={styles.sectionTitle}>
                        Pending Approval ({pendingComments.length})
                    </h2>

                    {pendingComments.length === 0 ? (
                        <p className={styles.empty}>No pending comments.</p>
                    ) : (
                        <div className={styles.list}>
                            {pendingComments.map((comment) => (
                                <div key={comment.id} className={styles.card}>
                                    <div className={styles.commentMeta}>
                                        <strong>{comment.name}</strong>
                                        <span className={styles.email}>({comment.email})</span>
                                        <span className={styles.date}>
                                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className={styles.target}>
                                        On: {comment.book?.title || comment.blogPost?.title || 'Unknown'}
                                    </p>
                                    <p className={styles.commentText}>{comment.content}</p>
                                    <div className={styles.actions}>
                                        <form action={approveComment} style={{ display: 'inline' }}>
                                            <input type="hidden" name="id" value={comment.id} />
                                            <button type="submit" className={styles.approveBtn}>Approve</button>
                                        </form>
                                        <form action={deleteComment} style={{ display: 'inline' }}>
                                            <input type="hidden" name="id" value={comment.id} />
                                            <button type="submit" className={styles.deleteBtn}>Delete</button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Approved Section */}
                <section style={{ marginTop: '3rem' }}>
                    <h2 className={styles.sectionTitle}>Approved Comments</h2>

                    {approvedComments.length === 0 ? (
                        <p className={styles.empty}>No approved comments yet.</p>
                    ) : (
                        <div className={styles.list}>
                            {approvedComments.map((comment) => (
                                <div key={comment.id} className={styles.card}>
                                    <div className={styles.commentMeta}>
                                        <strong>{comment.name}</strong>
                                        <span className={styles.date}>
                                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p className={styles.target}>
                                        On: {comment.book?.title || comment.blogPost?.title || 'Unknown'}
                                    </p>
                                    <p className={styles.commentText}>{comment.content}</p>

                                    {/* Replies */}
                                    {comment.replies.length > 0 && (
                                        <div className={styles.replies}>
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className={styles.reply}>
                                                    <strong>{reply.name}</strong>
                                                    <span className={styles.date}>
                                                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'short', day: 'numeric'
                                                        })}
                                                    </span>
                                                    <p>{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className={styles.actions}>
                                        <details className={styles.replyDetails}>
                                            <summary className={styles.replyToggle}>Reply</summary>
                                            <form action={adminReply} className={styles.replyForm}>
                                                <input type="hidden" name="parentId" value={comment.id} />
                                                {comment.bookId && <input type="hidden" name="bookId" value={comment.bookId} />}
                                                {comment.blogPostId && <input type="hidden" name="blogPostId" value={comment.blogPostId} />}
                                                <textarea name="content" rows={3} placeholder="Write your reply..." required className={styles.replyTextarea} />
                                                <button type="submit" className={styles.approveBtn}>Send Reply</button>
                                            </form>
                                        </details>
                                        <form action={deleteComment} style={{ display: 'inline' }}>
                                            <input type="hidden" name="id" value={comment.id} />
                                            <button type="submit" className={styles.deleteBtn}>Delete</button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
