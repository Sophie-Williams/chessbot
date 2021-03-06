/* eslint-disable no-unused-vars */

exports.up = async (knex, Promise) => (await knex.schema.hasTable('games'))
  ? null
  : knex.schema.createTable('games', (table) => {
    table.increments('id')
    table.bigInteger('whites_id').unsigned().notNullable()
    table.bigInteger('blacks_id').unsigned().notNullable()
    table.string('inline_id').notNullable().unique().index()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.text('config').defaultTo('{}')

    table.foreign('whites_id').references('id').on('users')
    table.foreign('blacks_id').references('id').on('users')
  })

exports.down = async (knex, Promise) => (await knex.schema.hasTable('games'))
  ? knex.schema.dropTable('games')
  : null
