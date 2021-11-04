const
    responseService = require('./ResponseService'),
    httpUtil = require('../util/http-util'),
    API_CONSTANTS = require('../constants/api'),
    config = require('../config/index'),
    Logger = require('../util/logger');
_ = require('lodash');

module.exports = class FlightService {

    /**
      * @param flights
      * @params array of flights
      * */

    mergeFlightsArray = (flightResults) => {
        const flightsArray = flightResults.map(res => {
            if (res) return JSON.parse(res).flights;
        })
        return _.flatMap(flightsArray);
    }


    getFlights = async () => {
        return Promise.all(API_CONSTANTS.SOURCE_API.map(async api => {
            let params = {
                operation: httpUtil.sendHttpRequest(api.API_URL, API_CONSTANTS.METHODS.GET, config.headers),
                timeout: config.timeout,
                delay: config.delay,
                retries: config.retries
            }
            Logger.info(`Start Processing Response with params ${JSON.stringify(params)}`);
            return responseService.processResponse(params)
        }));
    }


    async process() {
        try {
            Logger.info(`Fetching Flights from API`);
            const results = await this.getFlights();
            if (results) {
                const mergedArray = this.mergeFlightsArray(results);
                return mergedArray;

            }
            Logger.info(`Flights response ${results}`);

        } catch (error) {
            Logger.error(`Failed to process:  ${JSON.stringify(error)}`);

        }
    }
}