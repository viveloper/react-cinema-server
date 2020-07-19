const fs = require('fs');
const path = require('path');

// @desc    Get review
// @route   GET /api/review
// @access  Public
exports.getReview = (req, res, next) => {
  const movieCode = req.query.movieCode;
  const page = req.query.page ? req.query.page : 1;
  const count = req.query.count ? req.query.count : 10;
  const sortType = req.query.sortType ? req.query.sortType : 'recent';

  const sourceDataPath = `../data/movieDetail/${movieCode}-review.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const review = JSON.parse(jsonData);
  const sortedReview = {
    ...review,
    TotalReviewItems: {
      ...review.TotalReviewItems,
      Items:
        sortType === 'recent'
          ? review.TotalReviewItems.Items
          : review.TotalReviewItems.Items.sort(
              (a, b) => b.RecommandCount - a.RecommandCount
            ),
    },
  };

  const begin = count * (page - 1);
  const end =
    count * page < sortedReview.TotalReviewItems.Items.length
      ? count * page
      : sortedReview.TotalReviewItems.Items.length;
  const pagedReview = {
    ...sortedReview,
    TotalReviewItems: {
      ...sortedReview.TotalReviewItems,
      Items: sortedReview.TotalReviewItems.Items.slice(begin, end),
      ItemCount: end - begin,
    },
  };

  res.status(200).json(pagedReview);
};

// @desc    Post review
// @route   GET /api/review
// @access  Public
exports.postReview = (req, res, next) => {
  res.status(200).json({ success: true });
};
