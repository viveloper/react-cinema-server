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

// @desc    Get seats
// @route   GET /api/ticketing/seats
// @access  Public
exports.getSeats = (req, res, next) => {
  const playDate = req.query.playDate;
  const cinemaId = req.query.cinemaId;
  const screenDivisionCode = req.query.screenDivisionCode;
  const screenId = req.query.screenId;
  const playSequence = req.query.playSequence;

  const sourceDataPath = `../data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const seats = JSON.parse(jsonData);
  res.status(200).json(seats);
};

// @desc    Reserve seats
// @route   PUT /api/ticketing/seats
// @access  Private
exports.reserveSeats = (req, res, next) => {
  const playDate = req.query.playDate;
  const cinemaId = req.query.cinemaId;
  const screenDivisionCode = req.query.screenDivisionCode;
  const screenId = req.query.screenId;
  const playSequence = req.query.playSequence;

  const { seatNoList } = req.body;

  const loginUser = req.user;

  const sourceDataPath = `../data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`;
  const jsonData = fs.readFileSync(path.resolve(__dirname, sourceDataPath));
  const seatsData = JSON.parse(jsonData);

  seatNoList.forEach((seatNo) => {
    // Seats update
    const targetSeat = seatsData.Seats.Items.find(
      (seat) => seat.SeatNo === seatNo
    );
    targetSeat.SeatStatusCode = 50;

    // BookingSeats update
    seatsData.BookingSeats.Items.push({
      SeatNo: targetSeat.SeatNo,
      SeatRow: targetSeat.SeatRow,
      SeatColumn: targetSeat.SeatColumn,
      SeatColumnGroupNo: targetSeat.SeatColumGroupNo,
      ShowSeatRow: targetSeat.ShowSeatRow,
      ShowSeatColumn: targetSeat.ShowSeatColumn,
    });
  });

  fs.writeFileSync(
    path.resolve(__dirname, sourceDataPath),
    JSON.stringify(seatsData)
  );

  // User ticketing data update
  const jsonUserData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonUserData);
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  const ticketingResult = {
    playDate,
    cinemaId,
    screenDivisionCode,
    screenId,
    playSequence,
    seatNoList,
  };

  if (!targetUser.ticketing) {
    targetUser.ticketingList = [ticketingResult];
  } else {
    targetUser.ticketingList.push(ticketingResult);
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../data/users/users.json'),
    JSON.stringify(usersData)
  );

  res.status(200).json({
    success: true,
    ticketing: ticketingResult,
  });
};
