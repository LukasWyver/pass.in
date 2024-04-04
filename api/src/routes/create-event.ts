import { z } from "zod"
import { db } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { generateSlug } from "../utils/generate-slug"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export async function createEvent(app: FastifyInstance) {

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      },
    }, async (request, reply) => {
    
      const { title, details, maximumAttendees} = request.body

      const slug = generateSlug(title)

      const eventWithSameSlug = await db.event.findUnique({
        where: {
          slug,
        }
      })

      if(eventWithSameSlug !== null) {
        throw new Error('Another event with same title already exists.')
      }

      const event = await db.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        }
      })

      return reply.status(201).send({ eventId: event.id })
  })
}