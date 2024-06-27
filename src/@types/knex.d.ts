// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string
      name: string
      avatar: string
      whatsapp: string
      bio: string
    }
    classes: {
      id: string
      subject: string
      cost: string
      user_id: string
    }
    classes_schedule: {
      id: string
      week_day: number
      from: string
      to: string
      class_id: string
    }
    connections: {
      id: string
      user_id: string
    }
  }
}
