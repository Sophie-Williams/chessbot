const { debug, getGame } = require('@/helpers')

module.exports = () => [
  /^settings(?:::(\w+))?(?:::(\w+))?$/,
  async (ctx) => {
    const gameEntry = await getGame(ctx)

    if (typeof gameEntry === 'boolean') {
      return gameEntry
    }

    switch (ctx.match[1]) {
      case 'rotation':
        switch (ctx.match[2]) {
          case 'whites':
          case 'blacks':
          case 'dynamic':
            const game = await ctx.db('games')
              .where('inline_id', ctx.callbackQuery.inline_message_id)
              .first()
              .catch(debug)

            if (game) {
              let { config } = game

              config = JSON.parse(config) || {}
              config.rotation = ctx.match[2]

              await ctx.db('games')
                .update({ config: JSON.stringify(config) })
                .where('id', game.id)
                .catch(debug)
            }

            return ctx.answerCbQuery(`You choose ${ctx.match[2]} rotation mode.`)

          default:
            await ctx.editMessageReplyMarkup({
              inline_keyboard: [
                [{
                  text: 'Whites at bottom',
                  callback_data: 'settings::rotation::whites',
                }],
                [{
                  text: 'Blacks at bottom',
                  callback_data: 'settings::rotation::blacks',
                }],
                [{
                  text: 'Current mover at bottom',
                  callback_data: 'settings::rotation::dynamic',
                }],
                [{
                  text: '⬅️ Back to settings',
                  callback_data: 'settings',
                }],
              ],
            }).catch(debug)

            return ctx.answerCbQuery('Please choose a rotation mode!')
        }

      default:
        await ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{
              text: 'Board Rotation',
              callback_data: 'settings::rotation',
            }],
            [{
              text: '⬅️ Back to game',
              callback_data: 'back',
            }],
          ],
        }).catch(debug)

        return ctx.answerCbQuery('Please choose a setting you want to change!')
    }
  },
]
