'use server'

import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// For real use, you'd load these from process.env
// const SMTP_HOST = process.env.SMTP_HOST
// const SMTP_PORT = process.env.SMTP_PORT
// const SMTP_USER = process.env.SMTP_USER
// const SMTP_PASS = process.env.SMTP_PASS

export async function submitOrder(formData: FormData) {
    try {
        const customerName = formData.get('customerName') as string
        const customerEmail = formData.get('customerEmail') as string
        const address = formData.get('address') as string
        const city = formData.get('city') as string
        const province = formData.get('province') as string
        const postalCode = formData.get('postalCode') as string
        const items = formData.get('items') as string
        const totalAmount = parseFloat(formData.get('totalAmount') as string)

        // Save strictly to DB
        const order = await prisma.order.create({
            data: {
                customerName,
                customerEmail,
                address,
                city,
                province,
                postalCode,
                totalAmount,
                status: 'PENDING',
                items
            }
        })

        // Prepare Email Content
        const emailBody = `
      Hello ${customerName},

      Thank you for your order from Jeannette Musselman Books! 
      Your order ID is: ${order.id}.
      
      **Total Due: $${totalAmount.toFixed(2)} CAD**
      
      To complete your order, please send an Interac E-Transfer for the total amount to:
      [Insert Jeannette's Real Email Here]

      Once we receive the E-Transfer, we will ship the books to:
      ${address}, ${city}, ${province}, ${postalCode}

      Blessings,
      Jeannette Musselman
    `

        // Simulating NodeMailer send
        // In production, we'd uncomment standard nodemailer configuration
        console.log('----- SIMULATING EMAIL SEND -----')
        console.log('To:', customerEmail)
        console.log('Subject: Your Book Order Instructions')
        console.log(emailBody)
        console.log('---------------------------------')

        return { success: true, orderId: order.id }

    } catch (error) {
        console.error(error)
        return { error: 'Failed to process the order. Please try again.' }
    }
}
