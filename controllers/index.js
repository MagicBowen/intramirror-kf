const logger = require('../logger').logger('index');
const chatbot = require('../domain/chatbot')
const fs = require('mz/fs');

const MESSAGE_TEXT_TYPE = 0;
const REQUEST_TALK_MESSAGE_TYPE = 1;


var handleMsg = async (ctx, next) => {
    const msg = ctx.request.body;
    logger.debug(msg);
    if (msg.request_type === REQUEST_TALK_MESSAGE_TYPE ) {
        if (msg.message_type === MESSAGE_TEXT_TYPE) {
            const text = msg.text;
            logger.info(`Receive msg : ${text}`);
            const file = `${__dirname}/../static/image/01.png`;
            const image = fs.createReadStream(file);
            const reply = {chat_id : msg.chat_id, 
                           chat_type : msg.chat_type, 
                           text : text, 
                           image : image,
                           entities : [
                                {
                                    type: 1,
                                    offset : 0,
                                    length : 2,
                                    url : 'http://xiaoda.ai',
                                    sharable : 0
                                },
                                {
                                    type: 0,
                                    user_id: msg.user_id,
                                    nickname: msg.nickname
                                }
                           ],
                           reply_keyboard : {
                            resize_keyboard : 1,
                            keyboard : [
                                [{type : 0, text : 'button'}, {type : 1, text : 'card'}],
                                [{type : 2, text : 'position'}, {type : 3, content : 'help'}]
                            ]
                           }
                          };
            chatbot.send('sendImageMessage', reply);
        }
    }
}

var index = async (ctx, next) => {
    ctx.render('index.html');
};

module.exports = {
    'GET /'  : index,
    'POST /' : handleMsg
};