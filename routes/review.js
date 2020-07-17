const express = require('express');
const { getReview } = require('../controllers/review');

const router = express.Router();

router.route('/').get(getReview);

module.exports = router;
