/* eslint-disable consistent-return */
const _ = require('lodash');
const responseService = require('./ResponseService');
const httpUtil = require('../util/http-util');
const API_CONSTANTS = require('../constants/api');
const config = require('../config/index');
const Logger = require('../util/logger');

const mergeAndRemoveDuplicateFlights = (flightResults) => {
  let filteredFlights = [];
  try {
    const flights = [];
    const validFlights = _.filter(flightResults, Boolean);
    const result = _.flatMap(validFlights);
    if (result.length) {
      for (let i = 0; i < result.length; i++) {
        result[i].slices.forEach((slice) => {
          flights.push(slice);
        });
      }
      /* eslint-disable max-len */
      // removed duplicates for same flight number and arrival_date_time_utc
      // ignoresd price as i am not clear about it
      filteredFlights = flights.filter((v, i, a) => a.findIndex((t) => (t.flight_number === v.flight_number && t.arrival_date_time_utc === v.arrival_date_time_utc)) === i);
    }
    return filteredFlights;
  } catch (err) {
    Logger.error(`Failed to process:  ${err}`);
    // throw other unhandled errors
    throw err;
  }
};

const getFlights = async () => Promise.all(
  API_CONSTANTS.SOURCE_API.map(async (api) => {
    const params = {
      operation: httpUtil.sendHttpRequest(
        api.API_URL,
        API_CONSTANTS.METHODS.GET,
        config.headers,
      ),
      timeout: config.timeout,
      delay: config.delay,
      retries: config.retries,
    };
    Logger.info(
      `Start Processing Response with params ${JSON.stringify(params)}`,
    );
    return responseService.processResponse(params);
  }),
);

const process = async () => {
  try {
    Logger.info('Fetching Flights from API');
    const results = await getFlights();
    Logger.info(`Flights response ${results}`);
    return mergeAndRemoveDuplicateFlights(results);
  } catch (error) {
    Logger.error(`Failed to process:  ${error}`);
  }
};

module.exports = {
  process,
};
