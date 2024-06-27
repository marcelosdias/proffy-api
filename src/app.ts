import { fastify } from 'fastify'
import { classesRoutes } from './routes/classes'
import { ZodError } from 'zod'
import { connectionsRoutes } from './routes/connections'
import { env } from './env'

export const app = fastify()

app.register(classesRoutes, { prefix: '/classes' })
app.register(connectionsRoutes, { prefix: '/connections' })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  }

  return reply.status(500).send({ message: 'Interal server error!' })
})
