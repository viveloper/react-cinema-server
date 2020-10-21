const fs = require('fs');
const path = require('path');
const { getRandomInt } = require('../utils');

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

// @desc    Get userTicketing
// @route   GET /api/ticketing/userTicketing
// @access  Private
exports.getUserTicketingList = (req, res, next) => {
  const userId = req.user.id;

  const jsonUserTicketingData = fs.readFileSync(
    path.resolve(__dirname, '../data/ticketing/userTicketingData.json')
  );
  const userTicketingData = JSON.parse(jsonUserTicketingData);
  const userTicketingList = userTicketingData.ticketingList.filter(
    (item) => item.userId === userId
  );
  res.status(200).json({
    userTicketingList,
  });
};

// @desc    Add userTicketing
// @route   POST /api/ticketing/userTicketing
// @access  Private
exports.addUserTicketing = (req, res, next) => {
  const {
    movieCode,
    movieName,
    posterUrl,
    viewGradeCode,
    divisionCode,
    detailDivisionCode,
    cinemaId,
    cinemaName,
    screenId,
    screenName,
    screenDivisionCode,
    screenDivisionName,
    playSequence,
    playDate,
    playDay,
    startTime,
    endTime,
    seatNoList,
    price,
  } = req.body;

  const loginUser = req.user;

  // User Ticketing Data Update
  const jsonUserTicketingData = fs.readFileSync(
    path.resolve(__dirname, '../data/ticketing/userTicketingData.json')
  );
  const userTicketingData = JSON.parse(jsonUserTicketingData);

  const ticketingId = getRandomInt(10000000, 1000000000);
  const userTicketing = {
    ticketingId,
    userId: loginUser.id,
    movieCode,
    movieName,
    posterUrl,
    viewGradeCode,
    divisionCode,
    detailDivisionCode,
    cinemaId,
    cinemaName,
    screenId,
    screenName,
    screenDivisionCode,
    screenDivisionName,
    playSequence,
    playDate,
    playDay,
    startTime,
    endTime,
    seatNoList,
    price,
  };

  userTicketingData.ticketingList.push(userTicketing);

  fs.writeFileSync(
    path.resolve(__dirname, '../data/ticketing/userTicketingData.json'),
    JSON.stringify(userTicketingData)
  );

  // Seats Data Update
  const sourceDataPath = `../data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`;
  const jsonSeatsData = fs.readFileSync(
    path.resolve(__dirname, sourceDataPath)
  );
  const seatsData = JSON.parse(jsonSeatsData);

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

  // PlaySequence data update
  const playSeqsDataPath = `../data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`;
  const jsonPlaySeqsData = fs.readFileSync(
    path.resolve(__dirname, playSeqsDataPath)
  );
  const playSeqsData = JSON.parse(jsonPlaySeqsData);
  const targetPlaySeqsData = playSeqsData.PlaySeqs.Items.find(
    (item) => item.ScreenID === screenId && item.PlaySequence === playSequence
  );
  targetPlaySeqsData.BookingSeatCount -= seatNoList.length;
  fs.writeFileSync(
    path.resolve(__dirname, playSeqsDataPath),
    JSON.stringify(playSeqsData)
  );

  // User Data Update
  const jsonUserData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonUserData);
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  if (!targetUser.ticketingList.length) {
    targetUser.ticketingList = [ticketingId];
  } else {
    targetUser.ticketingList.push(ticketingId);
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../data/users/users.json'),
    JSON.stringify(usersData)
  );

  res.status(200).json({
    userTicketing,
  });
};

// @desc    Delete userTicketing
// @route   DELETE /api/ticketing/userTicketing/:ticketingId
// @access  Private
exports.deleteUserTicketing = (req, res, next) => {
  const ticketingId = parseInt(req.params.ticketingId);

  const loginUser = req.user;

  // User Ticketing Data Update
  const jsonUserTicketingData = fs.readFileSync(
    path.resolve(__dirname, '../data/ticketing/userTicketingData.json')
  );
  const userTicketingData = JSON.parse(jsonUserTicketingData);

  const targetUserTicketing = userTicketingData.ticketingList.find(
    (userTicketing) => userTicketing.ticketingId === ticketingId
  );
  userTicketingData.ticketingList = userTicketingData.ticketingList.filter(
    (userTicketing) => userTicketing.ticketingId !== ticketingId
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../data/ticketing/userTicketingData.json'),
    JSON.stringify(userTicketingData)
  );

  // Seats Data Update
  const {
    divisionCode,
    detailDivisionCode,
    cinemaId,
    screenId,
    screenDivisionCode,
    playSequence,
    playDate,
    seatNoList,
  } = targetUserTicketing;
  const sourceDataPath = `../data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`;
  const jsonSeatsData = fs.readFileSync(
    path.resolve(__dirname, sourceDataPath)
  );
  const seatsData = JSON.parse(jsonSeatsData);

  seatNoList.forEach((seatNo) => {
    // Seats update
    const targetSeat = seatsData.Seats.Items.find(
      (seat) => seat.SeatNo === seatNo
    );
    targetSeat.SeatStatusCode = 0;

    // BookingSeats update
    const targetBookingSeatIdx = seatsData.BookingSeats.Items.findIndex(
      (item) => item.SeatNo === seatNo
    );
    seatsData.BookingSeats.Items.splice(targetBookingSeatIdx, 1);
  });

  fs.writeFileSync(
    path.resolve(__dirname, sourceDataPath),
    JSON.stringify(seatsData)
  );

  // PlaySequence data update
  const playSeqsDataPath = `../data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`;
  const jsonPlaySeqsData = fs.readFileSync(
    path.resolve(__dirname, playSeqsDataPath)
  );
  const playSeqsData = JSON.parse(jsonPlaySeqsData);
  const targetPlaySeqsData = playSeqsData.PlaySeqs.Items.find(
    (item) => item.ScreenID === screenId && item.PlaySequence === playSequence
  );
  targetPlaySeqsData.BookingSeatCount += seatNoList.length;
  fs.writeFileSync(
    path.resolve(__dirname, playSeqsDataPath),
    JSON.stringify(playSeqsData)
  );

  // User Data Update
  const jsonUserData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonUserData);
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  const targetTicketingIdx = targetUser.ticketingList.indexOf(ticketingId);
  targetUser.ticketingList.splice(targetTicketingIdx, 1);

  fs.writeFileSync(
    path.resolve(__dirname, '../data/users/users.json'),
    JSON.stringify(usersData)
  );

  res.status(200).json({
    success: true,
    userTicketing: targetUserTicketing,
  });
};
