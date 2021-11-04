const wait = ms => new Promise(r => setTimeout(r, ms));

async function retryOperation(params) {
  try {
    const result = await params.operation;
    return result;
  } catch (error) {
    await wait(params.delay);
    if (error.statusCode === 503) {
      if (params.retries > 0) {
        params.retries = params.retries -1
        return retryOperation(params)
      } else {
        return JSON.stringify([]);
      }
    }
    return error;
  }
}
  module.exports = {
    retryOperation 
  }