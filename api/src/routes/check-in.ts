import z from 'zod';
import { db } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import { BadRequest } from './_errors/bad-request';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/attendees/:attendeeId/check-in', {
    schema: {
      summary: 'Check-in an attendee',
      tags: ['check-ins'],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params

    const attendeeCheckIn = await db.checkIn.findUnique({
      where: {
        attendeeId,
      }
    })

    if(attendeeCheckIn !== null){
      throw new BadRequest('Attendee already checked in!')
    }

    await db.checkIn.create({
      data: {
        attendeeId
      }
    })

    return reply.status(201).send()
  })
}