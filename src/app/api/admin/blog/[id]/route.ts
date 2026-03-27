import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(
    _request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    const post = await prisma.blogPost.findUnique({
        where: { id: params.id },
    })

    if (!post) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(post)
}
