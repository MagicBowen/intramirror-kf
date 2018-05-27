const Telegraf = require('telegraf')
const Koa = require('koa')
const koaBody = require('koa-body')
const config = require('./config.json')
const logger = require('./logger').logger('app');

const bot = new Telegraf(config.token)

bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
bot.on('text', ({ reply }) => reply('Hello'))

bot.telegram.setWebhook(`${config.rootUrl}/telebot`)

const app = new Koa()

app.use(async (ctx, next) => {
    logger.info(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
    logger.info(`... response in duration ${execTime}ms`);
});

app.use(koaBody())

app.use(async (ctx, next) => {
    if (ctx.url === '/telebot' && ctx.method === 'POST') {
        logger.debug('receive msg from telegram...');
        await bot.handleUpdate(ctx.request.body, ctx.response);
        logger.debug('... handle msg of telegram over!');
        return;
    }
    next();
});

app.listen(8080)
logger.info(`Server is running on localhost:8080...`);
