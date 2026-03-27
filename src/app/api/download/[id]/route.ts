import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    })

    if (!product || !product.pdfUrl) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    await prisma.product.update({
        where: { id: params.id },
        data: { downloadCount: { increment: 1 } },
    })

    return NextResponse.redirect(new URL(product.pdfUrl, _request.url))
}
