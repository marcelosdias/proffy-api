import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('classes_schedule', (table) => {
    table.uuid('id').primary()

    table.integer('week_day').notNullable()
    table.string('from').notNullable()
    table.string('to').notNullable()

    table
      .uuid('class_id')
      .notNullable()
      .references('id')
      .inTable('classes')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('classes_schedule')
}
