'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navigation() {
    const pathname = usePathname()

    return (
        <nav>
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                        src="/logo.png"
                        alt="Jeannette Musselman Logo"
                        width={120}
                        height={120}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>
            </div>
            <div className="nav-links">
                <Link href="/" className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}>
                    Home
                </Link>
                <Link href="/books" className={`nav-link ${pathname.startsWith('/books') ? 'nav-link-active' : ''}`}>
                    Books
                </Link>
                <Link href="/blog" className={`nav-link ${pathname.startsWith('/blog') ? 'nav-link-active' : ''}`}>
                    Blog
                </Link>
            </div>
        </nav>
    )
}
