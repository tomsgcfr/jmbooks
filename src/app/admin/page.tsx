import Link from 'next/link'
import styles from './admin.module.css'
import { logout } from './login/actions'
import { prisma } from '../../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const pendingCount = await prisma.comment.count({
        where: { approved: false },
    })

    const subscriberCount = await prisma.subscriber.count()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Jeannette&apos;s Admin Dashboard</h1>
                <form action={logout}>
                    <button className={styles.logoutButton}>Log Out</button>
                </form>
            </header>

            <main className={styles.main}>
                <p className={styles.instructions}>
                    Welcome, Jeannette! What would you like to do?
                </p>

                <div className={styles.dashboardGrid}>
                    <Link href="/admin/books" className={styles.dashboardCard}>
                        <span className={styles.cardIcon}>📚</span>
                        <h2>Manage Books</h2>
                        <p>Add, edit or remove your books</p>
                    </Link>

                    <Link href="/admin/blog" className={styles.dashboardCard}>
                        <span className={styles.cardIcon}>✍️</span>
                        <h2>Manage Blog</h2>
                        <p>Write new blog posts</p>
                    </Link>

                    <Link href="/admin/comments" className={styles.dashboardCard}>
                        <span className={styles.cardIcon}>💬</span>
                        <h2>Manage Comments</h2>
                        <p>Approve or reply to reader comments</p>
                        {pendingCount > 0 && (
                            <span className={styles.badge}>{pendingCount} pending</span>
                        )}
                    </Link>

                    <Link href="/admin/subscribers" className={styles.dashboardCard}>
                        <span className={styles.cardIcon}>📧</span>
                        <h2>Subscribers</h2>
                        <p>View newsletter subscribers</p>
                        {subscriberCount > 0 && (
                            <span className={styles.badge} style={{ background: '#5c8d89' }}>{subscriberCount} total</span>
                        )}
                    </Link>

                    <Link href="/admin/settings" className={styles.dashboardCard}>
                        <span className={styles.cardIcon}>⚙️</span>
                        <h2>Settings</h2>
                        <p>Change your password</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}
