const retryUtil = require('../util/retry-handling');
const Logger = require('../util/logger');
const httpUtil = require('../util/http-util');
const API_CONSTANTS = require('../constants/api');
const config = require('../config/index');
// eslint-disable-next-line consistent-return
const processResponse = async (api, retry = false) => {
  let result = [];
  try {
    Logger.info(`processResponse: ${api} - retry: ${retry}`);
    if (retry) {
      result = await retryUtil.retryOperation(paraapims);
    }
    // eslint-disable-next-line max-len
    const promise = [ httpUtil.sendHttpRequest(api, API_CONSTANTS.METHODS.GET, config.headers), new Promise((resolve) => setTimeout(() => resolve([]), config.timeout))];
    result = await Promise.race(promise);
    const { flights } = JSON.parse(result);
    if (!flights) return result;
    Logger.info(`processResponse: flights ${flights}`);
    return flights;
  } catch (error) {
    if (error.statusCode === 503) {
      Logger.error('The endpoint returned Service Unavailable.');
      return [];
    }
  }
};

module.exports = {
  processResponse,
};
