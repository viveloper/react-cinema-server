const express = require('express');
const { getReview, postReview } = require('../controllers/review');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getReview).post(protect, postReview);

module.exports = router;
