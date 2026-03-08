import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany({})

  const products = [
    {
      title: 'Sorrow to Everlasting Joy',
      description: 'This book is a must read for everyone who struggles with sorrow, condemnation, guilt, unworthiness, depression or even battles with thoughts that God is angry with them. Salvation by grace alone through faith could not be better understood.',
      price: 25.00,
      imageUrl: '/books/sorrow-to-everlasting-joy.jpg',
      isBundle: false,
    },
    {
      title: 'Freedom in Christ',
      description: 'A deep and profound teaching for those who desire the meat of the Word and who desire to know more about this loving God who has given us everything through His Son, Jesus.',
      price: 25.00,
      imageUrl: '/books/freedom-in-christ.jpg',
      isBundle: false,
    },
    {
      title: 'New Creation in Christ',
      description: 'Are you feeling like you will never measure up? Do you want to walk in the victory Jesus died to give you? This book will help you see yourself as a brand new creation in Christ Jesus.',
      price: 15.00,
      imageUrl: '/books/new-creation.jpg',
      isBundle: false,
    },
    {
      title: "Receive God's Free Gift of Healing",
      description: 'The intention of this book is that you will receive healing to your spirit, soul and body. It is designed to cause faith to rise up in You. It will help you to conceive the Word and give birth to healing and wholeness.',
      price: 15.00,
      imageUrl: '/books/healing.jpg',
      isBundle: false,
    },
    {
      title: 'Are You Clothed with the Armor of God?',
      description: 'This booklet will give you understanding on how to be fully clothed with the Armor of God. Being clothed with His Armor is not an external clothing but one that takes place on the inside of you.',
      price: 10.00,
      imageUrl: '/books/armor-of-god.jpg',
      isBundle: false,
    },
    {
      title: 'Was JOB Self-Righteous?',
      description: 'The Holy Spirit said to Jeannette one morning that God rebuked Job for his self-righteousness. This booklet reveals what the Holy Spirit showed her from His Word.',
      price: 10.00,
      imageUrl: '/books/was-job-self-righteous.jpg',
      isBundle: false,
    },
    {
      title: 'Who is the God of the Bible?',
      description: 'This booklet will lead you to scriptures in the Word of God that reveal the Trinity and reveal that Jesus is, in fact, God.',
      price: 7.50,
      imageUrl: '/books/god-of-the-bible.jpg',
      isBundle: false,
    },
    // Bundles
    {
      title: 'Bundle: Sorrow to Everlasting Joy and Freedom in Christ',
      description: 'Get both deeply moving and foundational books at a discounted price.',
      price: 40.00,
      imageUrl: '/books/sorrow-to-everlasting-joy.jpg', // or combine images later
      isBundle: true,
    },
    {
      title: "Bundle: New Creation in Christ and Receive God's Free Gift of Healing",
      description: 'Empower yourself with a renewed mind and spirit regarding healing and new life.',
      price: 25.00,
      imageUrl: '/books/new-creation.jpg',
      isBundle: true,
    },
    {
      title: 'Bundle: Are You Clothed with the Armor of God? and Was JOB Self-Righteous?',
      description: 'Deep dive booklets into the armor of God and a new perspective on Job.',
      price: 17.50,
      imageUrl: '/books/armor-of-god.jpg',
      isBundle: true,
    },
    {
      title: '3 Booklets Bundle',
      description: 'Includes Are You Clothed with the Armor of God?, Was JOB Self-Righteous?, and Who is the God of the Bible?',
      price: 24.00,
      imageUrl: '/books/god-of-the-bible.jpg',
      isBundle: true,
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

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
