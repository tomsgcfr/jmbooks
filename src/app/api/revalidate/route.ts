import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
    revalidatePath('/')
    revalidatePath('/shop')
    return NextResponse.json({ revalidated: true, now: Date.now() })
}
