import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../connection'
import { convertHourToMinutes } from '../utils/convertHourToMinutes'

export async function classesRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const searchQuerySchema = z.object({
      subject: z.string(),
      week_day: z.string(),
      time: z.string(),
    })

    const { subject, week_day, time } = searchQuerySchema.parse(request.query)

    const timeInMinutes = convertHourToMinutes(time)

    const classes = await knex('classes')
      .whereExists(function () {
        this.select('classes_schedule.*')
          .from('classes_schedule')
          .whereRaw('`classes_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`classes_schedule`.`week_day` = ?', [Number(week_day)])
          .whereRaw('`classes_schedule`.`from` <= ?', [timeInMinutes])
          .whereRaw('`classes_schedule`.`to` > ?', [timeInMinutes])
      })
      .where('subject', subject)
      .innerJoin('classes_schedule', 'classes.id', 'classes_schedule.class_id')
      .where('classes_schedule.week_day', week_day)

    return reply.send({ classes })
  })

  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      avatar: z.string(),
      whatsapp: z.string(),
      bio: z.string(),
      subject: z.string(),
      cost: z.string(),
      schedule: z.array(
        z.object({
          week_day: z.coerce.number(),
          to: z.coerce.string(),
          from: z.coerce.string(),
        }),
      ),
    })

    const { name, avatar, whatsapp, bio, subject, cost, schedule } =
      createUserSchema.parse(request.body)

    const trx = await knex.transaction()

    const [createdUser] = await trx('users')
      .insert({
        id: randomUUID(),
        name,
        avatar,
        bio,
        whatsapp,
      })
      .returning('id')

    const [createdClass] = await trx('classes')
      .insert({
        id: randomUUID(),
        subject,
        cost,
        user_id: createdUser.id,
      })
      .returning('id')

    const classSchedule = schedule.map((scheduleItems) => {
      return {
        id: randomUUID(),
        week_day: scheduleItems.week_day,
        from: convertHourToMinutes(scheduleItems.from),
        to: convertHourToMinutes(scheduleItems.to),
        class_id: createdClass.id,
      }
    })

    await trx('classes_schedule').insert(classSchedule)

    await trx.commit()

    return reply
      .status(201)
      .send({ userId: createdUser.id, classId: createdClass.id })
  })
}
