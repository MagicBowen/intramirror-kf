
const API_URL = 'https://botapi.chaoxin.com/';
const API_TOKEN = '670672:e33ccc36bd3b4342fb5315f07d17f526';

var index = async (ctx, next) => {
    ctx.render('index.html');
};

var chatbot = async (ctx, next) => {
    
}

module.exports = {
    'GET /'  : index,
    'POST /' : chatbot
};