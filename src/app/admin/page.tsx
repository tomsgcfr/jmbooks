import { PrismaClient } from '@prisma/client'
import styles from './admin.module.css'
import { logout } from './login/actions'
import { updateProduct } from './actions'

const prisma = new PrismaClient()

export default async function AdminDashboard() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
    })

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
                    Welcome! Here you can easily change the price or description of your books.
                    Simply click &quot;Edit&quot; on a book, type your changes, and click &quot;Save&quot;.
                </p>

                <div className={styles.grid}>
                    {products.map(product => (
                        <details key={product.id} className={styles.card}>
                            <summary className={styles.summary}>
                                <div className={styles.summaryContent}>
                                    <img src={product.imageUrl || ''} alt="" className={styles.thumb} />
                                    <div className={styles.summaryText}>
                                        <h2>{product.title}</h2>
                                        <p className={styles.price}>${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <span className={styles.editBtn}>Edit</span>
                            </summary>

                            <div className={styles.editFormContainer}>
                                <form action={updateProduct} className={styles.editForm}>
                                    <input type="hidden" name="id" value={product.id} />

                                    <label>Title</label>
                                    <input type="text" name="title" defaultValue={product.title} required />

                                    <label>Price ($)</label>
                                    <input type="number" step="0.01" name="price" defaultValue={product.price} required />

                                    <label>Description</label>
                                    <textarea name="description" defaultValue={product.description} rows={5} required />

                                    <button type="submit" className={styles.saveButton}>Save Changes</button>
                                </form>
                            </div>
                        </details>
                    ))}
                </div>
            </main>
        </div>
    )
}
