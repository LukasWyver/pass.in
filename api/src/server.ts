import fastify from 'fastify'
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import { checkIn } from './routes/check-in';
import { getEvent } from './routes/get-event';
import { createEvent } from './routes/create-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { registerForEvent } from './routes/register-for-event';
import { getEventAttendees } from './routes/get-event-attendees';

import { errorHandler } from './error-handler';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";

const app = fastify()

app.register(fastifyCors, {
  origin: '*',  
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'Especificações da API para o back-end da aplicação pass.in construída durante o NLW Unite da Rocketseat.',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(checkIn)
app.register(getEvent)
app.register(createEvent)
app.register(registerForEvent)
app.register(getAttendeeBadge)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running 🚀!')
})