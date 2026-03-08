'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string
    const price = parseFloat(formData.get('price') as string)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!id) return

    try {
        await prisma.product.update({
            where: { id },
            data: {
                price,
                title,
                description
            }
        })

        // Refresh the admin page data
        revalidatePath('/admin')
        revalidatePath('/') // also refresh the homepage/shop
    } catch (e) {
        console.error(e)
    }
}
