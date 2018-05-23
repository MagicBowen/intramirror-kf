// const requestJson = require('request-json');

// function syncPost(uri, data) {
//     var client = requestJson.createClient(uri);
//     return new Promise(function (resolve, reject) {
//         client.post('query', data, function (error, res, body) {
//         if (!error && res.statusCode == 200) {
//           resolve(body.reply);
//         } else {
//           reject(error);
//         }
//       });
//     });
// }

const request = require('request');
var FormData = require('form-data');

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

function syncPost(uri, data) {
    return new Promise( (resolve, reject) => {
      request.post({url : uri, formData : data })
      .on('response', function(response) {
        resolve(response);
      })
      .on('error', function(error) {
        reject(error);
      })
  });
}

// function syncPost(uri, data, file) {
//   var form = new FormData(data);
//   return new Promise( (resolve, reject) => {
//     request.post(uri)
//     .on('response', function(response) {
//       if (file) {
//         form.append('image', fs.createReadStream(file));
//       }
//       resolve(response);
//     })
//     .on('error', function(error) {
//       reject(error);
//     })
// });
// }

module.exports.syncPost = syncPost;
module.exports.syncGet = syncGet;