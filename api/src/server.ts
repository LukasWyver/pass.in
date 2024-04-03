import fastify from 'fastify'
import { z } from 'zod'
import { db } from './lib/prisma'
import { generateSlug } from './utils/generate-slug'

const app = fastify()

app.post('/events', async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()
  })

  const data = createEventSchema.parse(request.body)

  const { title, details, maximumAttendees} = data

  const event = await db.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug: generateSlug(title)
    }
  })

  return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running 🚀!')
})