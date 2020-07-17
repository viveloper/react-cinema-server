const fs = require('fs');
const path = require('path');

// @desc    Get special cinemas info
// @route   GET /api/specials
// @access  Public
exports.getSpecials = (req, res, next) => {
  const jsonData = fs.readFileSync(
    path.resolve(__dirname, '../data/home/cinemaData.json')
  );
  const specials = JSON.parse(jsonData);
  res.status(200).json(specials);
};
