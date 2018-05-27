const Telegraf = require('telegraf')
const Koa = require('koa')
const koaBody = require('koa-body')
const config = require('./config.json')

const bot = new Telegraf(config.token)

bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
bot.on('text', ({ reply }) => reply('Hello'))

bot.telegram.setWebhook(`${config.rootUrl}/telebot`)

const app = new Koa()
app.use(koaBody())
app.use((ctx, next) => ctx.method === 'POST' || ctx.url === '/telebot'
  ? bot.handleUpdate(ctx.request.body, ctx.response)
  : next()
)
app.listen(8080)
