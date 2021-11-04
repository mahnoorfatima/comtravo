const express = require('express');
const flightController = require('../controller/flightController');

const router = express.Router();

router.get('/check', (req, res) => res.json({ status: 'Ok' }));

router.get('/flights', flightController.getFlights);

module.exports = router;
