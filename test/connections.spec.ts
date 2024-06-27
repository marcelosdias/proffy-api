import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Connections routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new connection', async () => {
    const createClassResponse = await request(app.server)
      .post('/classes')
      .send({
        name: 'John Doe',
        avatar: 'avatarUrl',
        whatsapp: '12345678',
        bio: 'Some bio',
        subject: 'Math',
        cost: '80',
        schedule: [
          { week_day: 0, from: '8:00', to: '12:00' },
          { week_day: 2, from: '10:00', to: '14:00' },
        ],
      })

    const { userId } = createClassResponse.body

    await request(app.server).post('/connections').send({ user_id: userId })
  })

  it('should be able to get total number of connections', async () => {
    const createClassResponse = await request(app.server)
      .post('/classes')
      .send({
        name: 'John Doe',
        avatar: 'avatarUrl',
        whatsapp: '12345678',
        bio: 'Some bio',
        subject: 'Math',
        cost: '80',
        schedule: [
          { week_day: 0, from: '8:00', to: '12:00' },
          { week_day: 2, from: '10:00', to: '14:00' },
        ],
      })

    const { userId } = createClassResponse.body

    await request(app.server).post('/connections').send({ user_id: userId })

    const countConnectionsResponse = await request(app.server)
      .get('/connections')
      .send()

    expect(countConnectionsResponse.statusCode).toEqual(200)
    expect(countConnectionsResponse.body).toEqual(
      expect.objectContaining({
        total: 1,
      }),
    )
  })
})
