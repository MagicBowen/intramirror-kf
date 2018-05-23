const logger = require('../logger').logger('index');
const chatbot = require('../domain/chatbot')

const MESSAGE_TEXT_TYPE = 0;
const REQUEST_TALK_MESSAGE_TYPE = 1;

var receiveMsg = async (ctx, next) => {
    const msg = ctx.request.body;
    logger.info(msg);
    if (msg.request_type === REQUEST_TALK_MESSAGE_TYPE ) {
        if (msg.message_type === MESSAGE_TEXT_TYPE) {
            const text = msg.text;
            logger.info(`Receive msg : ${msg}`);
            chatbot.send('sendTextMessage', {chat_id : msg.chat_id, chat_type : msg.chat_type, text : text});
        }
    } 
}

var index = async (ctx, next) => {
    ctx.render('index.html');
};

module.exports = {
    'GET /'  : index,
    'POST /' : receiveMsg
};