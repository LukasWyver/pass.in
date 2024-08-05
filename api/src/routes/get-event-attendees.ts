import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/events/:eventId/attendees', {
    schema: {
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default('0').transform(Number),
      }),
      responde: { 
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkedInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params
    const { pageIndex, query } = request.query

    const attendees = await db.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: query ? {
        eventId,
        name: {
          contains: query,          
          mode: 'insensitive' // Adicione essa linha
        }
      } : { eventId },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return reply.send({ 
      attendees: attendees.map(attendee => {
      return {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
        checkedInAt: attendee.checkIn?.createdAt ?? null,
      }
    })
   })
  })
}