const express = require('express');
const {
  getTicketingData,
  getPlaySequence,
  getSeats,
} = require('../controllers/ticketing');

const router = express.Router();

router.route('/').get(getTicketingData);
router.route('/playSequence').get(getPlaySequence);
router.route('/seats').get(getSeats);

module.exports = router;
