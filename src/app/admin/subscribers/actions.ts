'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../../../lib/prisma'

export async function deleteSubscriber(formData: FormData) {
    const id = formData.get('id') as string

    if (!id) return

    await prisma.subscriber.delete({ where: { id } })
    revalidatePath('/admin/subscribers')
}
