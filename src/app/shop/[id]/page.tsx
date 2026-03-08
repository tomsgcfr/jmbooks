import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../../../components/AddToCartButton'
import styles from './detail.module.css'

const prisma = new PrismaClient()

export default async function ProductDetail(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await prisma.product.findUnique({
        where: { id: params.id }
    })

    if (!product) {
        notFound()
    }

    return (
        <main className={styles.detailContainer}>
            <Link href="/shop" className={styles.backLink}>&larr; Back to Shop</Link>

            <div className={styles.grid}>
                <div className={styles.imageColumn}>
                    {product.imageUrl && (
                        <div className={styles.bookWrapper}>
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className={styles.coverImage}
                                priority
                            />
                        </div>
                    )}
                </div>

                <div className={styles.infoColumn}>
                    {product.isBundle && <span className={styles.badge}>Special Bundle</span>}
                    <h1 className={styles.title}>{product.title}</h1>
                    <p className={styles.price}>${product.price.toFixed(2)}</p>

                    <div className={styles.description}>
                        <p>{product.description}</p>
                    </div>

                    <div className={styles.actions}>
                        <AddToCartButton product={product} className="btn-primary" />
                    </div>
                </div>
            </div>
        </main>
    )
}
