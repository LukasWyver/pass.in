import { z } from "zod";
import { db } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/events/:eventId', {
    schema: {
      summary: 'Get an event',
      tags: ['events'],
      params: z.object({
        eventId: z.string().uuid()
      }),
      responde: {
        200: {
          event: z.object({
            id: z.string().uuid(),
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        }
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params

    const event = await db.event.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    })

    if(event === null){
      throw new BadRequest('Event not found.')
    }

    return reply.send({ 
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttendees: event.maximumAttendees,
        attendeesAmount: event._count.attendees
      }
    })
  })
}