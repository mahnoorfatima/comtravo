/* eslint-disable no-async-promise-executor */
const Logger = require('log-winston-aws-level');
const Request = require('request');

async function sendHttpRequest(url, method, headers, body) {
  return new Promise(async (resolve, reject) => {
    let postBody = '';

    if (body) {
      if (typeof body === 'object') {
        postBody = JSON.stringify(body);
      } else if (typeof body === 'string') {
        postBody = body;
      }
    }

    if (!headers) {
      // eslint-disable-next-line no-param-reassign
      headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postBody),
      };
    } else if (!headers['Content-Length']) {
      // eslint-disable-next-line no-param-reassign
      headers['Content-Length'] = Buffer.byteLength(postBody);
    }

    const options = {
      url,
      method,
      headers,
    };
    if (Logger.currentLevel() === 'debug') {
      Logger.debug(`HTTP Request: ${JSON.stringify(options)}`);
    }

    Request(options, (error, response, responseBody) => {
      if (error) {
        Logger.error(`Error Response: ${JSON.stringify(response)}`);
        Logger.error(`Error Response Body: ${responseBody}`);
        Logger.error(`Error Response Error: ${error}`);
        reject(error);
      } else if (!error && response.statusCode === 200) {
        if (Logger.currentLevel() === 'debug') {
          Logger.debug(`Success Response (${response.statusCode}, ${response.statusMessage}) Body: ${responseBody}`);
        }
        resolve(responseBody);
      } else {
        Logger.debug('Other Response: ', JSON.stringify(response));
        Logger.debug('Other Response Body: ', JSON.stringify(responseBody));
        Logger.debug('Other Response Error: ', JSON.stringify(error));
        reject(response);
      }
    });
  });
}

module.exports = {
  sendHttpRequest,
};
