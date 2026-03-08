import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigation'
import { CartProvider } from '../components/CartContext'
import CartSidebar from '../components/CartSidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: "Jeannette Musselman Books",
  description: "Uplifting books centered around Jesus Christ and the New Covenant of Grace.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <CartProvider>
          <div className="container">
            <Navigation />
            {children}
          </div>
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  )
}
