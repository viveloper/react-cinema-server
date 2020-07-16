const http = require('http');
const fs = require('fs');
const path = require('path');

// function download(url, dest) {
//   return new Promise((resolve, reject) => {
//     const file = fs.createWriteStream(dest, { flags: 'wx' });

//     const request = http.get(url, (response) => {
//       if (response.statusCode === 200) {
//         response.pipe(file);
//       } else {
//         file.close();
//         fs.unlink(dest, () => {}); // Delete temp file
//         reject(
//           `Server responded with ${response.statusCode}: ${response.statusMessage}`
//         );
//       }
//     });

//     request.on('error', (err) => {
//       file.close();
//       fs.unlink(dest, () => {}); // Delete temp file
//       reject(err.message);
//     });

//     file.on('finish', () => {
//       resolve();
//     });

//     file.on('error', (err) => {
//       file.close();

//       if (err.code === 'EXIST') {
//         reject('File already exists');
//       } else {
//         fs.unlink(dest, () => {}); // Delete temp file
//         reject(err.message);
//       }
//     });
//   });
// }

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
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, (e) => {
      if (e) {
        reject(e.message);
      } else {
        resolve();
      }
    });
  });
}

const startDownload = async () => {
  // Movie Poster
  const jsonData = fs.readFileSync('./data/movies.json');
  const { Movies } = JSON.parse(jsonData);
  const movies = Movies.Items[0].Items;
  const posterUrls = movies.map((movie) => movie.PosterURL);
  try {
    for (let i = 0; i < posterUrls.length; i++) {
      const url = posterUrls[i];
      const dest = `./${url.split('//')[2]}`;
      // await createDirectories(dest);
      // await download(url, dest);
      console.log(`${dest} download complete.`);
    }
  } catch (error) {
    console.log(error);
  }

  // Movie Casting
  //// StaffImage

  // Movie Trailer
  //// ImageURL
  //// MediaURL
};

startDownload();
