import { db } from '../src/lib/prisma';

async function seed() {
  await db.event.create({
    data: {
      id: '176f5263-d395-4d27-ba5a-caaa7a5aad82',
      title: 'NLW Unite Summit',
      slug: 'nlw-unite-summit',
      details: 'Um evento p/ devs apaixonados(as) por código!',
      maximumAttendees: 120,
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  db.$disconnect()
})