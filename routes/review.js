const express = require('express');
const {
  getReview,
  addReview,
  deleteReview,
  editReview,
} = require('../controllers/review');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getReview)
  .post(protect, addReview)
  .delete(protect, deleteReview)
  .put(protect, editReview);

module.exports = router;
