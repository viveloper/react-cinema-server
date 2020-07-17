const express = require('express');
const {
  getTicketingData,
  getPlaySequence,
  getInvisibleMoviePlayInfo,
  getSeats,
} = require('../controllers/ticketing');

const router = express.Router();

router.route('/').get(getTicketingData);
router.route('/playSequence').get(getPlaySequence);
router.route('/invisibleMoviePlayInfo').get(getInvisibleMoviePlayInfo);
router.route('/seats').get(getSeats);

module.exports = router;
