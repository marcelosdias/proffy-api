import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Classes routes', () => {
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

  it('should be able to create a new class', async () => {
    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        userId: response.body.userId,
        classId: response.body.classId,
      }),
    )
  })

  it('should be able to list classes by query params', async () => {
    await request(app.server)
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

    const response = await request(app.server).get('/classes').query({
      week_day: 0,
      subject: 'Math',
      time: '9:00',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.classes).toHaveLength(1)
    expect(response.body.classes).toEqual([
      expect.objectContaining({
        subject: 'Math',
      }),
    ])
  })
})
