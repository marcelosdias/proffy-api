import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('classes', (table) => {
    table.uuid('id').primary()
    table.string('subject').notNullable()
    table.string('cost').notNullable()

    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('classes')
}
