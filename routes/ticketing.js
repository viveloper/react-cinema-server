const express = require('express');
const {
  getTicketingData,
  getPlaySequence,
  getSeats,
  reserveSeats,
} = require('../controllers/ticketing');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getTicketingData);
router.route('/playSequence').get(getPlaySequence);
router.route('/seats').get(getSeats).put(protect, reserveSeats);

module.exports = router;
