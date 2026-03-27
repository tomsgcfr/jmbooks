import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

const BASE_URL = 'https://jmbooks.online'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Jeannette Musselman Books — Free Christian Books on Grace",
    template: "%s | Jeannette Musselman Books",
  },
  description: "Free uplifting books and teachings by Jeannette Musselman centered around Jesus Christ and the New Covenant of Grace. Download all books for free.",
  keywords: ["Jeannette Musselman", "Christian books", "free Christian books", "New Covenant", "grace", "Jesus Christ", "faith", "healing", "righteousness"],
  authors: [{ name: "Jeannette Musselman" }],
  creator: "Jeannette Musselman",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Jeannette Musselman Books",
    title: "Jeannette Musselman Books — Free Christian Books on Grace",
    description: "Free uplifting books and teachings centered around Jesus Christ and the New Covenant of Grace.",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Jeannette Musselman Books" }],
  },
  twitter: {
    card: "summary",
    title: "Jeannette Musselman Books",
    description: "Free uplifting books and teachings centered around Jesus Christ and the New Covenant of Grace.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JM Books",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: "#5C8D89",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <div className="container">
          <Navigation />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
