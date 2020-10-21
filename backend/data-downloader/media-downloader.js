const http = require('http');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = http
      .get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
          file.close(() => {
            resolve();
          }); // close() is async, call cb after close completes.
        });
      })
      .on('error', function (err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        reject(err.message);
      });
  });
}

function createDirectories(pathname) {
  return new Promise((resolve, reject) => {
    const __dirname = path.resolve();
    // pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-zA-Z0-9]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, (e) => {
      if (e) {
        reject(e.message);
      } else {
        resolve();
      }
    });
  });
}

async function moviePosterDownload() {
  const jsonData = fs.readFileSync('./data/home/movies.json');
  const { Movies } = JSON.parse(jsonData);
  const movies = Movies.Items[0].Items.filter(
    (movie) => movie.RepresentationMovieCode !== 'AD'
  );
  const posterUrls = movies
    .map((movie) => movie.PosterURL)
    .filter((posterUrl) => !!posterUrl && posterUrl.startsWith('http'));
  try {
    for (let i = 0; i < posterUrls.length; i++) {
      const url = posterUrls[i];
      const dest = `./${url.split('//')[2]}`;
      await createDirectories(dest);
      await download(url, dest);
      console.log(`${dest} download complete.`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function movieDetailMediaDownload() {
  const jsonMovies = fs.readFileSync('./data/home/movies.json');
  const { Movies } = JSON.parse(jsonMovies);
  const movies = Movies.Items[0].Items.filter(
    (movie) => movie.RepresentationMovieCode !== 'AD'
  );
  const movieCodeList = movies
    .map((movie) => movie.RepresentationMovieCode)
    .filter((movieCode) => !!movieCode);
  try {
    for (let i = 0; i < movieCodeList.length; i++) {
      const movieCode = movieCodeList[i];
      const jsonMovieDetail = fs.readFileSync(
        `./data/movieDetail/${movieCode}.json`
      );
      const { Casting, Trailer } = JSON.parse(jsonMovieDetail);
      const castingList = Casting.Items;
      const trailerList = Trailer.Items;
      const staffImageUrls = castingList
        .map((casting) => casting.StaffImage)
        .filter(
          (staffImageUrl) => !!staffImageUrl && staffImageUrl.startsWith('http')
        );
      const trailerImageUrls = trailerList
        .map((trailer) => trailer.ImageURL)
        .filter(
          (trailerImageUrl) =>
            !!trailerImageUrl && trailerImageUrl.startsWith('http')
        );
      const trailerMediaUrls = trailerList
        .map((trailer) => trailer.MediaURL)
        .filter(
          (trailerMediaUrl) =>
            !!trailerMediaUrl && trailerMediaUrl.startsWith('http')
        );

      for (let j = 0; j < staffImageUrls.length; j++) {
        const url = staffImageUrls[j];
        const dest = `./${url.split('//')[2]}`;
        await createDirectories(dest);
        await download(url, dest);
        console.log(`${dest} download complete.`);
      }
      for (let j = 0; j < trailerImageUrls.length; j++) {
        const url = trailerImageUrls[j];
        const dest = `./${url.split('//')[2]}`;
        await createDirectories(dest);
        await download(url, dest);
        console.log(`${dest} download complete.`);
      }
      for (let j = 0; j < trailerMediaUrls.length; j++) {
        const url = trailerMediaUrls[j];
        const dest = `./${url.split('//')[2]}`;
        await createDirectories(dest);
        await download(url, dest);
        console.log(`${dest} download complete.`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// async function movieDetailPosterDownload() {
//   const jsonMovies = fs.readFileSync('./data/home/movies.json');
//   const { Movies } = JSON.parse(jsonMovies);
//   const movies = Movies.Items[0].Items.filter(
//     (movie) => movie.RepresentationMovieCode !== 'AD'
//   );
//   const movieCodeList = movies
//     .map((movie) => movie.RepresentationMovieCode)
//     .filter((movieCode) => !!movieCode);
//   try {
//     for (let i = 0; i < movieCodeList.length; i++) {
//       const movieCode = movieCodeList[i];
//       const jsonMovieDetail = fs.readFileSync(
//         `./data/movieDetail/${movieCode}.json`
//       );
//       const { Movie } = JSON.parse(jsonMovieDetail);
//       const url = 'http://caching.lottecinema.co.kr/' + Movie.PosterURL;
//       const dest = `./${url.split('//')[2]}`;
//       await createDirectories(dest);
//       await download(url, dest);
//       console.log(`${dest} download complete.`);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

const startDownload = async () => {
  await moviePosterDownload();
  await movieDetailMediaDownload();
  // await movieDetailPosterDownload();
};

startDownload();
