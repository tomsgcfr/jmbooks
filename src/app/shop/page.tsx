import { PrismaClient, type Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../components/AddToCartButton'
import styles from '../page.module.css'

const prisma = new PrismaClient()

export default async function Shop() {
    const books = await prisma.product.findMany({
        where: { isBundle: false },
        orderBy: { createdAt: 'asc' }
    })

    const bundles = await prisma.product.findMany({
        where: { isBundle: true },
        orderBy: { createdAt: 'asc' }
    })

    return (
        <main className={styles.main} style={{ paddingTop: '2rem' }}>
            <div className={styles.sectionHeader}>
                <h1>All Books</h1>
            </div>

            <div className={styles.bookGrid}>
                {books.map((book: Product) => (
                    <div key={book.id} className={styles.bookCard}>
                        <Link href={`/shop/${book.id}`} className={styles.bookImageContainer}>
                            {book.imageUrl && (
                                <div className={styles.book3d}>
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        fill
                                        className={styles.bookCover}
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                    <div className={styles.bookSpine}></div>
                                </div>
                            )}
                        </Link>
                        <div className={styles.bookInfo}>
                            <Link href={`/shop/${book.id}`}><h3>{book.title}</h3></Link>
                            <p className={styles.price}>${book.price.toFixed(2)}</p>
                            <AddToCartButton product={book} className={styles.addToCartBtn} />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.sectionHeader} style={{ marginTop: '6rem' }}>
                <h2>Special Bundles</h2>
            </div>

            <div className={styles.bookGrid}>
                {bundles.map((bundle: Product) => (
                    <div key={bundle.id} className={styles.bookCard}>
                        <Link href={`/shop/${bundle.id}`} className={styles.bookImageContainer}>
                            {bundle.imageUrl && (
                                <div className={styles.book3d}>
                                    <Image
                                        src={bundle.imageUrl}
                                        alt={bundle.title}
                                        fill
                                        className={styles.bookCover}
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                    <div className={styles.bookSpine}></div>
                                </div>
                            )}
                        </Link>
                        <div className={styles.bookInfo}>
                            <Link href={`/shop/${bundle.id}`}><h3>{bundle.title}</h3></Link>
                            <p className={styles.price}>${bundle.price.toFixed(2)}</p>
                            <AddToCartButton product={bundle} className={styles.addToCartBtn} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
