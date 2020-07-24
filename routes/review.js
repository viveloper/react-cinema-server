const express = require('express');
const {
  getReview,
  postReview,
  deleteReview,
} = require('../controllers/review');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getReview)
  .post(protect, postReview)
  .delete(protect, deleteReview);

module.exports = router;
