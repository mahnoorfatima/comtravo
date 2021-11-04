const
    express = require("express"),
    flightController = require('../controller/flightController'),
    router = express.Router();


router.get('/check', (req, res) => res.json({ status: 'Ok' }));

router.get('/flights', flightController.getFlights);

module.exports = router;