'use client'

import { useCart } from './CartContext'

type Props = {
    product: {
        id: string
        title: string
        price: number
        imageUrl: string | null
    }
    className?: string
}

export default function AddToCartButton({ product, className }: Props) {
    const { addToCart } = useCart()

    return (
        <button
            className={className || 'btn-primary'}
            onClick={(e) => {
                e.preventDefault() // prevent navigation if inside a link
                addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl || ''
                })
            }}
        >
            Add to Cart
        </button>
    )
}
