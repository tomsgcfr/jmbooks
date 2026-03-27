'use client'

import { useState } from 'react'
import { submitComment } from '../lib/actions/comments'
import styles from './CommentSection.module.css'

type Reply = {
    id: string
    name: string
    content: string
    createdAt: Date
}

type Comment = {
    id: string
    name: string
    content: string
    createdAt: Date
    replies: Reply[]
}

type Props = {
    bookId?: string
    blogPostId?: string
    comments: Comment[]
}

export default function CommentSection({ bookId, blogPostId, comments }: Props) {
    const [submitted, setSubmitted] = useState(false)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const result = await submitComment(formData)
        if (result.success) {
            setSubmitted(true)
            setReplyingTo(null)
        }
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>Comments</h2>

            {/* Comment Form */}
            {submitted ? (
                <div className={styles.successMessage}>
                    Thank you! Your comment will appear after approval.
                </div>
            ) : (
                <form action={handleSubmit} className={styles.form}>
                    <h3 className={styles.formTitle}>Leave a Comment</h3>
                    {bookId && <input type="hidden" name="bookId" value={bookId} />}
                    {blogPostId && <input type="hidden" name="blogPostId" value={blogPostId} />}
                    {/* Honeypot */}
                    <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="comment-name">Name</label>
                            <input type="text" id="comment-name" name="name" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="comment-email">Email</label>
                            <input type="email" id="comment-email" name="email" required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="comment-content">Comment</label>
                        <textarea id="comment-content" name="content" rows={4} required />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Submit Comment</button>
                </form>
            )}

            {/* Comments List */}
            {comments.length > 0 && (
                <div className={styles.commentsList}>
                    {comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <strong>{comment.name}</strong>
                                <span className={styles.commentDate}>
                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p className={styles.commentContent}>{comment.content}</p>

                            {!submitted && (
                                <button
                                    className={styles.replyBtn}
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                >
                                    Reply
                                </button>
                            )}

                            {/* Reply Form */}
                            {replyingTo === comment.id && !submitted && (
                                <form action={handleSubmit} className={styles.replyForm}>
                                    {bookId && <input type="hidden" name="bookId" value={bookId} />}
                                    {blogPostId && <input type="hidden" name="blogPostId" value={blogPostId} />}
                                    <input type="hidden" name="parentId" value={comment.id} />
                                    <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Name</label>
                                            <input type="text" name="name" required />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Email</label>
                                            <input type="email" name="email" required />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Reply</label>
                                        <textarea name="content" rows={3} required />
                                    </div>
                                    <button type="submit" className={styles.submitBtn}>Submit Reply</button>
                                </form>
                            )}

                            {/* Replies */}
                            {comment.replies.length > 0 && (
                                <div className={styles.replies}>
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className={styles.reply}>
                                            <div className={styles.commentHeader}>
                                                <strong>{reply.name}</strong>
                                                <span className={styles.commentDate}>
                                                    {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <p className={styles.commentContent}>{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
