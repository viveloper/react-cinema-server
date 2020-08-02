const fs = require('fs');
const path = require('path');

// @desc    Get user data
// @route   GET /api/user
// @access  Private
exports.getUser = (req, res, next) => {
  const userId = req.user.id;

  const sourceDataPath = '../data/users/users.json';
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const usersData = JSON.parse(jsonData);

  const {
    id,
    name,
    email,
    reviewList,
    reviewLikeList,
    ticketingList,
  } = usersData.users.find((user) => user.id === userId);

  res.status(200).json({
    id,
    name,
    email,
    reviewList,
    reviewLikeList,
    ticketingList,
  });
};
