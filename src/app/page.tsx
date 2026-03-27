import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { prisma } from '../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const books = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  })

  const recentPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jeannette Musselman',
    url: 'https://jmbooks.online',
    image: 'https://jmbooks.online/author-nobg.png',
    description: 'Christian author and teacher focused on grace, healing, and the New Covenant of Jesus Christ.',
    knowsAbout: ['Christianity', 'Grace', 'New Covenant', 'Faith', 'Healing'],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jeannette Musselman Books',
    url: 'https://jmbooks.online',
    description: 'Free uplifting books and teachings centered around Jesus Christ and the New Covenant of Grace.',
  }

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Discover the Freedom of Grace</h1>
          <p>
            Uplifting books and teachings by Jeannette Musselman centered around
            Jesus Christ and the New Covenant of Grace. All books are free to download.
          </p>
          <Link href="/books" className="btn-primary">
            Browse Free Books
          </Link>
        </div>
      </section>

      {/* All Books Section */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>All Books</h2>
          <Link href="/books" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.bookGrid}>
          {books.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              <Link href={`/books/${book.id}`} className={styles.bookImageContainer}>
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
                <Link href={`/books/${book.id}`}><h3>{book.title}</h3></Link>
                <p className={styles.freeLabel}>Free Download</p>
                <Link href={`/books/${book.id}`} className={styles.viewBookBtn}>
                  View Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className={styles.featured}>
          <div className={styles.sectionHeader}>
            <h2>Latest from the Blog</h2>
            <Link href="/blog" className={styles.viewAll}>View All</Link>
          </div>
          <div className={styles.blogGrid}>
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={styles.blogCard}>
                {post.imageUrl && (
                  <div className={styles.blogImageContainer}>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className={styles.blogImage}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                )}
                <div className={styles.blogCardContent}>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span className={styles.readMore}>Read More &rarr;</span>
                </div>
              </Link>
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
