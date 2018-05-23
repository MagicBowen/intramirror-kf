const postJson = require('../utils/syncpost').syncGet;
const logger = require('../logger').logger('chatbot');
const querystring = require('querystring');

const API_URL = 'https://botapi.chaoxin.com';
const API_TOKEN = '670672:e33ccc36bd3b4342fb5315f07d17f526';

var getUrl = (method, parameters) => {
    return API_URL + '/' + method + '/' + API_TOKEN + '?' + querystring.stringify(parameters);
}

var replyMsg = async (method, parameters) => {
    try {
        const result = await postJson(getUrl(method,parameters))
        logger.debug(`Post to chatbot successful, result = ${JSON.stringify(result)}!`);
    } catch(err) {
        logger.error(`Post to chatbot failed, because of ${err}!`);
    }
}

module.exports = {
    send  : replyMsg
};