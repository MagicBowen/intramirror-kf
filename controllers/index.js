const logger = require('../logger').logger('index');

var index = async (ctx, next) => {
    ctx.render('index.html');
};

module.exports = {
    'GET /'  : index
};