const Koa = require('koa');
const koaBody = require('koa-body');
const Router  = require('koa-router');
const session = require('koa-session');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');
const staticFiles = require('./static-files');
const logger = require('./logger').logger('server');

///////////////////////////////////////////////////////////
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? 80 : 8080;
const host = isProduction ? '0.0.0.0' : '127.0.0.1';

///////////////////////////////////////////////////////////
const app = new Koa();
app.keys = ['superupersessionsecret'];
app.use(convert(session(app)))

///////////////////////////////////////////////////////////
// log middleware
app.use(async (ctx, next) => {
    logger.info(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
    logger.info(`... response in duration ${execTime}ms`);
});

///////////////////////////////////////////////////////////
// deal static files:
app.use(staticFiles('/static/', __dirname + '/static'));

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
// add controllers:
app.use(controller());

/////////////////////////////////////////////////////////
// Catch unhandled exceptions
process.on('uncaughtException',function(err){
    logger.error('uncaughtException-->'+err.stack+'--'+new Date().toLocaleDateString()+'-'+new Date().toLocaleTimeString());
    process.exit();
});

/////////////////////////////////////////////////////////
const config = require('./config.json');
const Telegraf = require('telegraf');

const bot = new Telegraf(config.token);
bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }));
bot.on('text', ({ reply }) => reply('Hello'));

bot.telegram.setWebhook(config.rootUrl + '/' + 'telebot');

app.use(koaBody());
app.use((ctx, next) => {
    if (ctx.url === '/telebot') {
        logger.error(`received from telegram for ${ctx.method}`);
        bot.handleUpdate(ctx.request.body, ctx.response);
        return;
    } 
    next();
});

// app.use((ctx, next) => ctx.method === 'POST' || ctx.url === '/telebot'
//   ? bot.handleUpdate(ctx.request.body, ctx.response)
//   : next()
// )

/////////////////////////////////////////////////////////
app.listen(port, host);
logger.info(`Server is running on ${host}:${port}...`);