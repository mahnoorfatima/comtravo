const flightService = require('../services/FlightService');
const Logger = require('../util/logger');

const getFlights = async (req, res) => {
  let flights = [];
  try {
    flights = await flightService.process();
  } catch (error) {
    Logger.error(`Failed to process:  ${error}`);
  }
  return res.status(200).json({ flights });
};

module.exports = {
  getFlights,
};
