import Link from 'next/link'
import { prisma } from '../../../lib/prisma'
import { logout } from '../login/actions'
import { deleteSubscriber } from './actions'
import styles from './subscribers.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminSubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
    })

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin" className={styles.backBtn}>&larr; Back</Link>
                    <h1>Subscribers</h1>
                </div>
                <form action={logout}>
                    <button className={styles.logoutButton}>Log Out</button>
                </form>
            </header>

            <main className={styles.main}>
                <h2 className={styles.sectionTitle}>
                    Newsletter Subscribers ({subscribers.length})
                </h2>

                {subscribers.length === 0 ? (
                    <p className={styles.empty}>No subscribers yet.</p>
                ) : (
                    <div className={styles.list}>
                        {subscribers.map((subscriber) => (
                            <div key={subscriber.id} className={styles.card}>
                                <div className={styles.subscriberInfo}>
                                    <span className={styles.email}>{subscriber.email}</span>
                                    <span className={styles.date}>
                                        Subscribed {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <form action={deleteSubscriber}>
                                    <input type="hidden" name="id" value={subscriber.id} />
                                    <button type="submit" className={styles.deleteBtn}>Remove</button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
