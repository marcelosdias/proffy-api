import { FastifyInstance } from 'fastify'
import { knex } from '../connection'
import z from 'zod'

export async function connectionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const [totalConnections] = await knex('connections').count('* as total')

    return reply.send(totalConnections)
  })

  app.post('/', async (request, reply) => {
    const createConnectionSchema = z.object({
      user_id: z.string().uuid(),
    })

    const { user_id } = createConnectionSchema.parse(request.body)

    await knex('connections').insert({ user_id })

    return reply.status(201).send()
  })
}
