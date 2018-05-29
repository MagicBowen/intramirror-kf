const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const Koa = require('koa')
const koaBody = require('koa-body')
const config = require('./config.json')
const logger = require('./logger').logger('app');
const request = require('./utils/syncpost');

const bot = new Telegraf(config.token)

function onMsg(info) {
    logger.debug(`on msg : ${info}`);
}

bot.command('onetime', ({ reply }) =>
  reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
    .extra()
  )
)

bot.command('custom', ({ reply }) => {
  return reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra()
  )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
  return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
    return markup.resize()
      .keyboard([
        markup.contactRequestButton('Send contact'),
        markup.locationRequestButton('Send location')
      ])
  }))
})

bot.command('pyramid', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  ))
})

bot.command('simple', (ctx) => {
  return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
    Markup.keyboard(['Coke', 'Pepsi'])
  ))
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('Coke', 'Coke'),
      m.callbackButton('Pepsi', 'Pepsi')
    ])))
})

bot.command('random', (ctx) => {
  return ctx.reply('random example',
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]).extra()
  )
})

bot.command('caption', (ctx) => {
  return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    Extra.load({ caption: 'Caption' })
      .markdown()
      .markup((m) =>
        m.inlineKeyboard([
          m.callbackButton('Plain', 'plain'),
          m.callbackButton('Italic', 'italic')
        ])
      )
  )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  ))
})

bot.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(() => next())
})

bot.action('plain', async (ctx) => {
  ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
    Markup.callbackButton('Plain', 'plain'),
    Markup.callbackButton('Italic', 'italic')
  ]))
})

bot.action('italic', (ctx) => {
  ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
    Markup.callbackButton('Plain', 'plain'),
    Markup.callbackButton('* Italic *', 'italic')
  ])))
})

////////////////////////////////////////////////////////
bot.command('image', (ctx) => {
    onMsg('image');
    return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
      Extra.load({ caption: 'image' })
        .markdown()
        .markup((m) =>
          m.inlineKeyboard([
            m.callbackButton('next', 'next'),
            m.callbackButton('reply', 'reply')
          ])
        )
    )
  })

bot.command('small', (ctx) => {
    onMsg('small face');
    return ctx.replyWithPhoto({ source: './static/image/small.png' }, Extra.load({ caption: 'this is my face, haha' }).markdown());
})  

bot.command('big', (ctx) => {
    onMsg('big face');
    return ctx.replyWithPhoto({ source: './static/image/big.png' });
})

bot.action('next', (ctx) => {
    onMsg('next');
    return ctx.editMessageCaption('new image', 
      Extra.markdown()
        .markup(Markup.inlineKeyboard([
      Markup.callbackButton('next', 'next'),
      Markup.callbackButton('reply', 'reply')
    ])))
  }) 

bot.hears('hi', (ctx) => {
    onMsg('hi');
    return ctx.reply('what?',     
        Markup.inlineKeyboard([
            Markup.callbackButton('modify', 'modify'),
            Markup.callbackButton('reply', 'reply')]).extra()
        );
    }
    );

bot.hears('switch', (ctx) => {
    onMsg('switch');
    return ctx.reply('switch',     
        Markup.inlineKeyboard([
            Markup.switchToChatButton('other', 'OK!'),
            Markup.switchToCurrentChatButton('reply', 'OK2: ')]).extra()
        )
    }
    );

bot.action('modify', (ctx) => {
    onMsg('modify');
    return ctx.editMessageText('how?',  Markup.inlineKeyboard([
        Markup.callbackButton('reply', 'reply')]).extra());
})

bot.action('reply', (ctx) => {
    onMsg('reply');
    return ctx.reply('reply?',  Markup.forceReply().extra());    
})

bot.action(/.+/, (ctx) => {
return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

////////////////////////////////////////////////////////
var users = {};

function findUserNameBy(id) {
    for (let user in users) {
        if (users[user] === id) {
            return user;
        }
    }
    return null;
}

////////////////////////////////////////////////////////
bot.command('register', (ctx) => {
    onMsg('register');

    let username = ctx.message.text.substring(ctx.message.text.split(' ')[0].length).trim();
    if (!username) username = ctx.from.first_name + ' ' + ctx.from.last_name;

    users[username] = ctx.from.id;
    return ctx.reply(`register ${username} successful!`);
})

bot.command('unregister', (ctx) => {
    onMsg('unregister');

    let username = ctx.message.text.substring(ctx.message.text.split(' ')[0].length).trim();
    if (!username) username = ctx.from.first_name + ' ' + ctx.from.last_name;
    
    users[username] = null;
    return ctx.reply(`unregister ${username} successful!`);
})

bot.hears(/.+/, (ctx) => {
    let fromName = findUserNameBy(ctx.from.id);
    if (!fromName) {
        logger.error(`Recieve msg from unregistered user ${ctx.from.id}`);
        return ctx.reply('You have not registered, please register first!');    
    }
    if (!ctx.message.reply_to_message) {
        return ctx.reply('You send a message with no receiver [help](https://www.magicbowen.top)!', Extra.markdown().webPreview());
    }
    let message = ctx.message.reply_to_message.text || ctx.message.reply_to_message.caption;
    if (message.split(':').length < 2) {
        return ctx.reply('Do not reply my message☹️!');
    }

    let toName = message.split(':')[0];
    let text = ctx.message.text;
    let msg = {
        from : { username : fromName },
        to   : { userId: toName },
        text : text
    }

    logger.debug(`${fromName} send msg [${text}] to ${toName}!`);

    const WECHAT_URL = 'https://www.magicbowen.top:443/wechat/msg';
    try {
      let result = await request.jsonPost(WECHAT_URL, msg);
      return ctx.reply(`send msg to ${toName} successful!`);
    } catch(err) {
      return ctx.reply(`send msg to ${toName} failed!`);
    }
})

////////////////////////////////////////////////////////
function handleMsg(msg) {
    let toUser = msg.to.userId;
    let userId = users[toUser];
    if (!userId) {
        logger.error(`Send msg to unregistered user [${toUser}] failed!`);
        return;
    }
    // bot.telegram.sendMessage(userId, `*${msg.from.username}* : ${msg.text}`, Extra.markdown());
    bot.telegram.sendPhoto(userId, { url: msg.from.profile },
    Extra.load({ caption: `*${msg.from.username}* : ${msg.text}` })
      .markdown());
}

////////////////////////////////////////////////////////
function init() {
    if (process.env.ROBOT === 'DOWN') {
        bot.telegram.deleteWebhook();
    } else {
        bot.telegram.setWebhook(`${config.rootUrl}/telebot`);
    }
}

init();

const app = new Koa()

app.use(async (ctx, next) => {
    logger.info(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
    logger.info(`... response in duration ${execTime}ms`);
});

app.use(koaBody());

app.use(async (ctx, next) => {
    if (ctx.url === '/telebot' && ctx.method === 'POST') {
        logger.debug('receive msg from telegram...');
        logger.debug(`${JSON.stringify(ctx.request.body)}`);
        await bot.handleUpdate(ctx.request.body, ctx.response);
        logger.debug('... handle msg of telegram over!');
        ctx.response.status = 200;
        return;
    }
    if (ctx.url === '/msg' && ctx.method === 'POST') {
        logger.debug('receive msg from server...');
        await handleMsg(ctx.request.body);
        logger.debug('... handle msg of server over!');
        ctx.response.status = 200;
        return;
    }
    next();
});

app.listen(8080)
logger.info(`Server is running on localhost:8080...`);
