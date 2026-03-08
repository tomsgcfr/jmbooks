import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import AddToCartButton from '../components/AddToCartButton'

const prisma = new PrismaClient()

export default async function Home() {
  const books = await prisma.product.findMany({
    where: { isBundle: false },
    orderBy: { createdAt: 'asc' },
  })

  const bundles = await prisma.product.findMany({
    where: { isBundle: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Discover the Freedom of Grace</h1>
          <p>
            Uplifting books and teachings by Jeannette Musselman centered around
            Jesus Christ and the New Covenant of Grace.
          </p>
          <Link href="/shop" className="btn-primary">
            Explore All Books
          </Link>
        </div>
      </section>

      {/* All Books Section */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>All Books</h2>
        </div>
        <div className={styles.bookGrid}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {books.map((book: any) => (
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
      </section>

      {/* Bundles Section */}
      {bundles.length > 0 && (
        <section className={styles.featured}>
          <div className={styles.sectionHeader}>
            <h2>Book Bundles</h2>
          </div>
          <div className={styles.bookGrid}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {bundles.map((bundle: any) => (
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
        </section>
      )}

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutImageContainer}>
            <Image
              src="/author-nobg.png"
              alt="Jeannette Musselman"
              width={280}
              height={235}
              className={styles.authorImage}
            />
          </div>
          <h2>About Jeannette Musselman</h2>
          <p>
            Jeannette has always had a deep love and concern for hurting people and a desire
            to pick up those that have been broken or who have fallen by the way. She is an
            excellent teacher who brings clarity and understanding so that every believer
            will be equipped and approved unto God.
          </p>
          <p>
            Her books lead readers out from living under condemnation, guilt and shame,
            and help them embrace the free gift of righteousness that Jesus died to give.
          </p>
        </div>
      </section>
    </main>
  )
}
