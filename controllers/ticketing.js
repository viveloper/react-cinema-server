const fs = require('fs');
const path = require('path');

// @desc    Get ticketing info
// @route   GET /api/ticketing
// @access  Public
exports.getTicketingData = (req, res, next) => {
  const sourceDataPath = '../data/ticketing/ticketingData.json';
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const ticketingData = JSON.parse(jsonData);
  res.status(200).json(ticketingData);
};

// @desc    Get movie play sequence
// @route   GET /api/ticketing/playSequence
// @access  Public
exports.getPlaySequence = (req, res, next) => {
  const playDate = req.query.playDate;
  const divisionCode = req.query.divisionCode;
  const detailDivisionCode = req.query.detailDivisionCode;
  const cinemaId = req.query.cinemaId;
  const movieCode = req.query.movieCode;

  const sourceDataPath = `../data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const playSequence = JSON.parse(jsonData);

  const filteredPlaySequence = !movieCode
    ? playSequence
    : {
        ...playSequence,
        PlaySeqsHeader: {
          ...playSequence.PlaySeqsHeader,
          Items: playSequence.PlaySeqsHeader.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ),
          ItemCount: playSequence.PlaySeqsHeader.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ).length,
        },
        PlaySeqs: {
          ...playSequence.PlaySeqs,
          Items: playSequence.PlaySeqs.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ),
          ItemCount: playSequence.PlaySeqs.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ).length,
        },
      };

  res.status(200).json(filteredPlaySequence);
};

// @desc    Get invisible movie play info
// @route   GET /api/ticketing/invisibleMoviePlayInfo
// @access  Public
exports.getInvisibleMoviePlayInfo = (req, res, next) => {
  res.status(200).json({});
};

// @desc    Get seats
// @route   GET /api/ticketing/seats
// @access  Public
exports.getSeats = (req, res, next) => {
  res.status(200).json({});
};
