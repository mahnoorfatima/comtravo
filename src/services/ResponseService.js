const retryUtil = require('../util/retry-handling');
const Logger = require('../util/logger');

// eslint-disable-next-line consistent-return
const processResponse = async (params, retry = false) => {
  let result = [];
  try {
    Logger.info(`processResponse: ${params} - retry: ${retry}`);
    if (retry) {
      Logger.info(`Retrying with params ${params}`);
      result = await retryUtil.retryOperation(params);
    }
    // eslint-disable-next-line max-len
    const promise = [params.operation, new Promise((resolve) => setTimeout(() => resolve([]), params.timeout))];
    result = await Promise.race(promise);
    const { flights } = JSON.parse(result);
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
