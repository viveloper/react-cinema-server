const fs = require('fs');
const path = require('path');

// @desc    Get movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = (req, res, next) => {
  let sourceDataPath = '';
  if (req.query.type === 'current') {
    sourceDataPath = '../data/movies/currentMovieList.json';
  } else if (req.query.type === 'pre') {
    sourceDataPath = '../data/movies/preMovieList.json';
  } else if (req.query.type === 'arte') {
    sourceDataPath = '../data/movies/arteMovieList.json';
  } else if (req.query.type === 'opera') {
    sourceDataPath = '../data/movies/operaMovieList.json';
  } else {
    sourceDataPath = '../data/home/movies.json';
  }
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const movies = JSON.parse(jsonData);
  res.status(200).json(movies);
};

// @desc    Get movie detail
// @route   GET /api/movies/:movieCode
// @access  Public
exports.getMovieDetail = (req, res, next) => {
  const movieCode = req.params.movieCode;
  const sourceDataPath = `../data/movieDetail/${movieCode}.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const movieDetail = JSON.parse(jsonData);
  res.status(200).json(movieDetail);
};
