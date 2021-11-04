const 
    retryUtil = require('../util/retry-handling'),
    Logger = require('../util/logger');

processResponse = async (params, retry = false) => {
    Logger.info(`processResponse: ${params} - retry: ${retry}`)
    if (retry) {
        Logger.info(`Retrying with params ${params}`)
        return retryUtil.retryOperation(params);
    }
    const response = await Promise.race([params.operation, new Promise(resolve => setTimeout(() => resolve([]), params.timeout))])
    Logger.info(`processResponse: Result ${response}`)
    return response;
}

module.exports = {
    processResponse
}