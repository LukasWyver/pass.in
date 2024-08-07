import fastify from 'fastify'
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getEvent } from './routes/get-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import { getEventAttendees } from './routes/get-event-attendees';

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(checkIn)
app.register(getEvent)
app.register(createEvent)
app.register(registerForEvent)
app.register(getAttendeeBadge)
app.register(getEventAttendees)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running 🚀!')
})