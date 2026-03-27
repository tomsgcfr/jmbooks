import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.comment.deleteMany({})
  await prisma.blogPost.deleteMany({})
  await prisma.product.deleteMany({})

  // Set default admin password (only if not already set)
  await prisma.adminSetting.upsert({
    where: { key: 'admin_password' },
    update: {},
    create: { key: 'admin_password', value: 'jeannette2026' },
  })

  await prisma.product.create({
    data: {
      title: 'Sorrow to Everlasting Joy',
      description: 'This book is a must read for everyone who struggles with sorrow, condemnation, guilt, unworthiness, depression or even battles with thoughts that God is angry with them. Salvation by grace alone through faith could not be better understood.',
      imageUrl: '/books/sorrow-to-everlasting-joy-final.jpg',
      pdfUrl: '/pdfs/sorrow-to-everlasting-joy.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: 'Freedom in Christ',
      description: 'A deep and profound teaching for those who desire the meat of the Word and who desire to know more about this loving God who has given us everything through His Son, Jesus.',
      imageUrl: '/books/freedom-in-christ-cover.jpg',
      pdfUrl: '/pdfs/freedom-in-christ.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: 'New Creation in Christ',
      description: 'Are you feeling like you will never measure up? Do you want to walk in the victory Jesus died to give you? This book will help you see yourself as a brand new creation in Christ Jesus.',
      imageUrl: '/books/new-creation-cover.jpg',
      pdfUrl: '/pdfs/new-creation-in-christ.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: "Receive God's Free Gift of Healing",
      description: 'The intention of this book is that you will receive healing to your spirit, soul and body. It is designed to cause faith to rise up in You. It will help you to conceive the Word and give birth to healing and wholeness.',
      imageUrl: '/books/healing-cover.jpg',
      pdfUrl: '/pdfs/receive-gods-free-gift-of-healing.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: 'Are You Clothed with the Armor of God?',
      description: 'This booklet will give you understanding on how to be fully clothed with the Armor of God. Being clothed with His Armor is not an external clothing but one that takes place on the inside of you.',
      imageUrl: '/books/armor-of-god-cover.jpg',
      pdfUrl: '/pdfs/are-you-clothed-with-the-armor-of-god.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: 'Was JOB Self-Righteous?',
      description: 'The Holy Spirit said to Jeannette one morning that God rebuked Job for his self-righteousness. This booklet reveals what the Holy Spirit showed her from His Word.',
      imageUrl: '/books/was-job-self-righteous-cover.jpg',
      pdfUrl: '/pdfs/was-job-self-righteous.pdf',
    },
  })

  await prisma.product.create({
    data: {
      title: 'Who is the God of the Bible?',
      description: 'This booklet will lead you to scriptures in the Word of God that reveal the Trinity and reveal that Jesus is, in fact, God.',
      imageUrl: '/books/god-of-the-bible-cover.jpg',
      pdfUrl: '/pdfs/who-is-the-god-of-the-bible.pdf',
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
