const FlightService = require('../services/FlightService')


const getFlights = async (req, res) => {
  try {
    const flightService = new FlightService()
    const flights = await flightService.process();
    return res.status(200).json({ flights })
  } catch (error) {

  }
}

module.exports = {
    getFlights
}
