const requestJson = require('request-json');

function syncPost(uri, data) {
    var client = requestJson.createClient(uri);
    return new Promise(function (resolve, reject) {
        client.post('query', data, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body.reply);
        } else {
          reject(error);
        }
      });
    });
}

const request = require('request')

function syncGet(uri) {
  return new Promise( (resolve, reject) => {
      request.get(uri)
      .on('response', function(response) {
        resolve(response);
      })
      .on('error', function(error) {
        reject(error);
      })
  });
}

module.exports.syncPost = syncPost;
module.exports.syncGet = syncGet;