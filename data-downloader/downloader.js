const axios = require('axios');
const qs = require('querystring');
const fs = require('fs');

// const osVersion = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
const osVersion =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';

const getCinemaData = async () => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetSepcialBannerInMain',
      channelType: 'HO',
      osType: 'W',
      osVersion,
      multiLanguageId: 'KR',
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Cinema/CinemaData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getMovie = async () => {
  const data = {
    channelType: 'HO',
    osType: 'W',
    osVersion,
    multiLanguageId: 'KR',
    data: { memberNoOn: '0' },
  };
  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCAPI/Home/getMovie',
    data
  );
  return res.data;
};

const getMovieList = async (type) => {
  let requestBody;
  if (type === 'current') {
    requestBody = {
      paramList: JSON.stringify({
        MethodName: 'GetMoviesToBe',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion,
        multiLanguageID: 'KR',
        division: 1,
        moviePlayYN: 'Y',
        orderType: 1,
        blockSize: 5,
        pageNo: 1,
      }),
    };
  } else if (type === 'pre') {
    requestBody = {
      paramList: JSON.stringify({
        MethodName: 'GetMoviesToBe',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion,
        multiLanguageID: 'KR',
        division: 1,
        moviePlayYN: 'N',
        orderType: 5,
        blockSize: 5,
        pageNo: 1,
      }),
    };
  } else if (type === 'arte') {
    requestBody = {
      paramList: JSON.stringify({
        MethodName: 'GetMoviesToBe',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion,
        multiLanguageID: 'KR',
        division: 2,
        moviePlayYN: '',
        orderType: 1,
        blockSize: 100,
        pageNo: 1,
        memberOnNo: '',
      }),
    };
  } else if (type === 'opera') {
    requestBody = {
      paramList: JSON.stringify({
        MethodName: 'GetMoviesByOpera',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion,
        multiLanguageID: 'KR',
        blockSize: 100,
        pageNo: 1,
        memberOnNo: '',
      }),
    };
  } else if (type === 'festivals') {
    requestBody = {
      paramList: JSON.stringify({
        MethodName: 'GetFestivals',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion,
        multiLanguageID: 'KR',
        memberOnNo: '',
      }),
    };
  }

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getMovieDetail = async (movieCode) => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetMovieDetailTOBE',
      channelType: 'HO',
      osType: 'Chrome',
      osVersion,
      multiLanguageID: 'KR',
      representationMovieCode: movieCode,
      memberOnNo: '',
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getMovieReview = async (movieCode, count) => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetReviews',
      channelType: 'HO',
      osType: 'Chrome',
      osVersion,
      representationMovieCode: movieCode,
      memberID: '',
      realReviewYN: 'Y',
      sortSeq: 1,
      pageNo: 1,
      pageSize: count,
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getMovieCastInfo = async (movieCode) => {
  const data = {
    MethodName: 'getMovieCastInfo',
    channelType: 'HO',
    osType: 'Chrome',
    osVersion,
    multiLanguageID: 'KR',
    data: { representationMovieCode: movieCode },
  };
  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCAPI/Movie/getMovieCastInfo',
    data
  );
  return res.data;
};

const getTicketingData = async () => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetTicketingPageTOBE',
      channelType: 'HO',
      osType: 'W',
      osVersion,
      memberOnNo: '0',
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getPlaySequence = async (
  playDate,
  divisionCode,
  detailDivisionCode,
  cinemaId,
  movieCode
) => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetPlaySequence',
      channelType: 'HO',
      osType: 'W',
      osVersion,
      playDate: playDate,
      cinemaID: `${divisionCode}|${detailDivisionCode}|${cinemaId}`,
      representationMovieCode: movieCode,
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getInvisibleMoviePlayInfo = async (
  playDate,
  divisionCode,
  detailDivisionCode,
  cinemaId,
  movieCode
) => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetInvisibleMoviePlayInfo',
      channelType: 'HO',
      osType: 'W',
      osVersion,
      cinemaList: `${divisionCode}|${detailDivisionCode}|${cinemaId}`,
      movieCd: movieCode,
      playDt: playDate,
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const getSeats = async (
  playDate,
  cinemaId,
  screenDivisionCode,
  screenId,
  playSequence
) => {
  const requestBody = {
    paramList: JSON.stringify({
      MethodName: 'GetSeats',
      channelType: 'HO',
      osType: 'W',
      osVersion,
      cinemaId,
      screenId,
      playDate,
      playSequence,
      screenDivisionCode,
    }),
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = await axios.post(
    'https://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    qs.stringify(requestBody),
    config
  );
  return res.data;
};

const startDownload = async () => {
  // // Home
  // // download CinemaData
  // const cinemaData = await getCinemaData();
  // fs.writeFileSync('./data/home/cinemaData.json', JSON.stringify(cinemaData));
  // console.log('CinemaData download complete.');
  // // download Movies
  // const movies = await getMovie();
  // fs.writeFileSync('./data/home/movies.json', JSON.stringify(movies));
  // console.log('Movies download complete.');
  // // Movies
  // // download MovieList
  // const currentMovieList = await getMovieList('current');
  // fs.writeFileSync(
  //   './data/movies/currentMovieList.json',
  //   JSON.stringify(currentMovieList)
  // );
  // console.log('currentMovieList download complete.');
  // const preMovieList = await getMovieList('pre');
  // fs.writeFileSync(
  //   './data/movies/preMovieList.json',
  //   JSON.stringify(preMovieList)
  // );
  // console.log('preMovieList download complete.');
  // const arteMovieList = await getMovieList('arte');
  // fs.writeFileSync(
  //   './data/movies/arteMovieList.json',
  //   JSON.stringify(arteMovieList)
  // );
  // console.log('arteMovieList download complete.');
  // const operaMovieList = await getMovieList('opera');
  // fs.writeFileSync(
  //   './data/movies/operaMovieList.json',
  //   JSON.stringify(operaMovieList)
  // );
  // console.log('operaMovieList download complete.');
  // // MovieDetail
  // const movies = await getMovie();
  // for (let i = 0; i < movies.Movies.Items[0].Items.length; i++) {
  //   const movie = movies.Movies.Items[0].Items[i];
  //   const movieCode = movie.RepresentationMovieCode;
  //   if (movieCode !== 'AD') {
  //     // MovieDetail
  //     const movieDetail = await getMovieDetail(movieCode);
  //     fs.writeFileSync(
  //       `./data/movieDetail/${movieCode}.json`,
  //       JSON.stringify(movieDetail)
  //     );
  //     console.log(`MovieDetail(${movieCode}) download complete.`);
  //     // MovieDetail - Review
  //     const tempMovieReview = await getMovieReview(movieCode, 0);
  //     const totalReviewCount = tempMovieReview.ReviewCounts.TotalReviewCount;
  //     const movieReview = await getMovieReview(movieCode, totalReviewCount);
  //     fs.writeFileSync(
  //       `./data/movieDetail/${movieCode}-review.json`,
  //       JSON.stringify(movieReview)
  //     );
  //     console.log(`MovieDetail-review(${movieCode}) download complete.`);
  //     // MovieDetail - Cast
  //     const movieCastInfo = await getMovieCastInfo(movieCode);
  //     fs.writeFileSync(
  //       `./data/movieDetail/${movieCode}-cast.json`,
  //       JSON.stringify(movieCastInfo)
  //     );
  //     console.log(`MovieDetail-cast(${movieCode}) download complete.`);
  //   }
  // }
  // // Ticketing
  // // download ticketingData
  // const ticketingData = await getTicketingData();
  // fs.writeFileSync(
  //   './data/ticketing/ticketingData.json',
  //   JSON.stringify(ticketingData)
  // );
  // console.log('ticketingData download complete.');
  // // download PlaySequence
  // const ticketingData = await getTicketingData();
  // for (
  //   let i = 0;
  //   i < ticketingData.CinemaDivison.AreaDivisions.Items.length;
  //   i++
  // ) {
  //   const divisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DivisionCode;
  //   const detailDivisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DetailDivisionCode;
  //   for (let j = 0; j < ticketingData.Cinemas.Cinemas.Items.length; j++) {
  //     if (
  //       ticketingData.Cinemas.Cinemas.Items[j].DivisionCode === divisionCode &&
  //       ticketingData.Cinemas.Cinemas.Items[j].DetailDivisionCode ===
  //         detailDivisionCode
  //     ) {
  //       const cinemaId = ticketingData.Cinemas.Cinemas.Items[j].CinemaID;
  //       for (
  //         let k = 0;
  //         k < ticketingData.MoviePlayDates.Items.Items.length;
  //         k++
  //       ) {
  //         const playDate = ticketingData.MoviePlayDates.Items.Items[k].PlayDate;
  //         const movieCode = '';
  //         const playSeqs = await getPlaySequence(
  //           playDate,
  //           divisionCode,
  //           detailDivisionCode,
  //           cinemaId,
  //           movieCode
  //         );
  //         fs.writeFileSync(
  //           `./data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`,
  //           JSON.stringify(playSeqs)
  //         );
  //         console.log(
  //           `playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId} download complete.`
  //         );
  //       }
  //     }
  //   }
  // }
  // // download InvisibleMoviePlayInfo
  // const ticketingData = await getTicketingData();
  // for (
  //   let i = 0;
  //   i < ticketingData.CinemaDivison.AreaDivisions.Items.length;
  //   i++
  // ) {
  //   const divisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DivisionCode;
  //   const detailDivisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DetailDivisionCode;
  //   for (let j = 0; j < ticketingData.Cinemas.Cinemas.Items.length; j++) {
  //     if (
  //       ticketingData.Cinemas.Cinemas.Items[j].DivisionCode === divisionCode &&
  //       ticketingData.Cinemas.Cinemas.Items[j].DetailDivisionCode ===
  //         detailDivisionCode
  //     ) {
  //       const cinemaId = ticketingData.Cinemas.Cinemas.Items[j].CinemaID;
  //       for (
  //         let k = 0;
  //         k < ticketingData.MoviePlayDates.Items.Items.length;
  //         k++
  //       ) {
  //         const playDate = ticketingData.MoviePlayDates.Items.Items[k].PlayDate;
  //         const movieCode = '';
  //         const invisibleMoviePlayInfo = await getInvisibleMoviePlayInfo(
  //           playDate,
  //           divisionCode,
  //           detailDivisionCode,
  //           cinemaId,
  //           movieCode
  //         );
  //         fs.writeFileSync(
  //           `./data/ticketing/invisibleMoviePlayInfo/invisibleMoviePlayInfo-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`,
  //           JSON.stringify(invisibleMoviePlayInfo)
  //         );
  //         console.log(
  //           `invisibleMoviePlayInfo-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId} download complete.`
  //         );
  //       }
  //     }
  //   }
  // }
  // // getSeats
  // const ticketingData = await getTicketingData();
  // for (
  //   let i = 0;
  //   i < ticketingData.CinemaDivison.AreaDivisions.Items.length;
  //   i++
  // ) {
  //   const divisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DivisionCode;
  //   const detailDivisionCode =
  //     ticketingData.CinemaDivison.AreaDivisions.Items[i].DetailDivisionCode;
  //   for (let j = 0; j < ticketingData.Cinemas.Cinemas.Items.length; j++) {
  //     if (
  //       ticketingData.Cinemas.Cinemas.Items[j].DivisionCode === divisionCode &&
  //       ticketingData.Cinemas.Cinemas.Items[j].DetailDivisionCode ===
  //         detailDivisionCode
  //     ) {
  //       const cinemaId = ticketingData.Cinemas.Cinemas.Items[j].CinemaID;
  //       for (
  //         let k = 0;
  //         k < ticketingData.MoviePlayDates.Items.Items.length;
  //         k++
  //       ) {
  //         const playDate = ticketingData.MoviePlayDates.Items.Items[k].PlayDate;
  //         const movieCode = '';
  //         const playSeqs = await getPlaySequence(
  //           playDate,
  //           divisionCode,
  //           detailDivisionCode,
  //           cinemaId,
  //           movieCode
  //         );
  //         for (let m = 0; m < playSeqs.PlaySeqs.Items.length; m++) {
  //           const playSeq = playSeqs.PlaySeqs.Items[m];
  //           const seatsInfo = await getSeats(
  //             playSeq.PlayDt,
  //             playSeq.CinemaID,
  //             playSeq.ScreenDivisionCode,
  //             playSeq.ScreenID,
  //             playSeq.PlaySequence
  //           );
  //           fs.writeFileSync(
  //             `./data/ticketing/seats/seatsInfo-${playSeq.PlayDt}-${playSeq.CinemaID}-${playSeq.ScreenDivisionCode}-${playSeq.ScreenID}-${playSeq.PlaySequence}.json`,
  //             JSON.stringify(seatsInfo)
  //           );
  //           console.log(
  //             `seatsInfo-${playSeq.PlayDt}-${playSeq.CinemaID}-${playSeq.ScreenDivisionCode}-${playSeq.ScreenID}-${playSeq.PlaySequence} download complete.`
  //           );
  //         }
  //       }
  //     }
  //   }
  // }
};

startDownload();
