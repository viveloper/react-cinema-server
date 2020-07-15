const http = require('http');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest, { flags: 'wx' });

    const request = http.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        file.close();
        fs.unlink(dest, () => {}); // Delete temp file
        reject(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`
        );
      }
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {}); // Delete temp file
      reject(err.message);
    });

    file.on('finish', () => {
      resolve();
    });

    file.on('error', (err) => {
      file.close();

      if (err.code === 'EEXIST') {
        reject('File already exists');
      } else {
        fs.unlink(dest, () => {}); // Delete temp file
        reject(err.message);
      }
    });
  });
}

const startDownload = async () => {
  const url =
    'http://caching.lottecinema.co.kr//Media/MovieFile/MovieImg/202007/16010_101_1.jpg';
  const dest = './Media/sample/sample.jpg';
  try {
    await download(url, dest);
    console.log(`${dest} download complete.`);
  } catch (error) {
    console.log(error);
  }
};

startDownload();
