const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getRandomInt } = require('../utils');

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
// @access  Private
exports.postReview = (req, res, next) => {
  const { movieCode, reviewText, evaluation } = req.body;
  const loginUser = req.user;

  const sourceDataPath = `../data/movieDetail/${movieCode}-review.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const reviewData = JSON.parse(jsonData);

  const reviewId = getRandomInt(10000000, 1000000000);

  const newReview = {
    ReviewID: reviewId,
    MemberNo: parseInt(loginUser.id),
    MemberID: loginUser.id,
    MemberName: loginUser.name,
    ReviewText: reviewText,
    MoviePlayYN: '',
    Evaluation: evaluation,
    RecommandCount: 0,
    MovieViewYN: '',
    RepresentationMovieCode: movieCode,
    MemberRecommandYN: '',
    RegistDate: new Date().toISOString().slice(0, 10).split('-').join('.'),
    ProfilePhoto: '',
    MemberNickName: '',
  };

  const reviewCount = reviewData.TotalReviewItems.Items.length;

  reviewData.TotalReviewItems.Items.unshift(newReview);
  reviewData.TotalReviewItems.ItemCount = reviewCount;
  reviewData.ReviewCounts.RealReviewCount = reviewCount;
  reviewData.ReviewCounts.TotalReviewCount = reviewCount;
  reviewData.ReviewCounts.MarkAvg = Math.floor(
    reviewData.TotalReviewItems.Items.reduce(
      (acc, review) => acc + review.Evaluation,
      0
    ) / reviewCount
  );

  fs.writeFileSync(
    path.resolve(__dirname, sourceDataPath),
    JSON.stringify(reviewData)
  );

  const jsonUserData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonUserData);
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  targetUser.reviewList.push(reviewId);

  fs.writeFileSync(
    path.resolve(__dirname, '../data/users/users.json'),
    JSON.stringify(usersData)
  );

  res.status(200).json({ success: true, review: newReview });
};

// @desc    Delete review
// @route   DELETE /api/review
// @access  Private
exports.deleteReview = (req, res, next) => {
  const { movieCode, reviewId } = req.body;
  const loginUser = req.user;

  const sourceDataPath = `../data/movieDetail/${movieCode}-review.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const reviewData = JSON.parse(jsonData);
  const targetReview = reviewData.TotalReviewItems.Items.find(
    (item) => item.ReviewID === reviewId
  );
  if (targetReview.MemberID !== loginUser.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized user',
    });
  }

  const idx = reviewData.TotalReviewItems.Items.indexOf(targetReview);
  reviewData.TotalReviewItems.Items.splice(idx, 1);

  const reviewCount = reviewData.TotalReviewItems.Items.length;

  reviewData.TotalReviewItems.ItemCount = reviewCount;
  reviewData.ReviewCounts.RealReviewCount = reviewCount;
  reviewData.ReviewCounts.TotalReviewCount = reviewCount;
  reviewData.ReviewCounts.MarkAvg = Math.floor(
    reviewData.TotalReviewItems.Items.reduce(
      (acc, review) => acc + review.Evaluation,
      0
    ) / reviewCount
  );

  fs.writeFileSync(
    path.resolve(__dirname, sourceDataPath),
    JSON.stringify(reviewData)
  );

  const jsonUserData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonUserData);
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  targetUser.reviewList = targetUser.reviewList.filter(
    (item) => item !== reviewId
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../data/users/users.json'),
    JSON.stringify(usersData)
  );

  res.status(200).json({ success: true, review: targetReview });
};
