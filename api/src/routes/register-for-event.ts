import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/events/:eventId/attendees', {
    schema: {
      body: z.object({
        name: z.string().min(4),
        email: z.string().email(),
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number(),
        })
      }
    },
  }, async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const attendeeFromEmail = await db.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email
          } 
        }
      })

      if(attendeeFromEmail !== null){
        throw new Error('This e-mail is already registered for this event.')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([    
        db.event.findUnique({
          where: {
            id: eventId
          }
        }),

        db.attendee.count({
          where: {
            eventId
          }
        })
      ])

      if(event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees){
        throw new Error('The maximum number of attendees for this event has been reached.')
      }

      const attendee = await db.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({ attendeeId: attendee.id })
  })
}