// const Telegraf = require('telegraf')
// const config = require('../config.json');
// const logger = require('../logger').logger('telegraf');

// const bot = new Telegraf(config.token);

// var botActions = () => {
//     bot.command('image', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }))
//     bot.on('text', ({ reply }) => reply('Hello'))  
//     bot.telegram.setWebhook(config.rootUrl + '/' + 'telebot')
// }

// var webhookHandler = async (ctx, next) => {
//     bot.handleUpdate(ctx.request.body, ctx.response);
//     next();
// }

// module.exports = {
//     'POST /telebot'  : webhookHandler
// };


