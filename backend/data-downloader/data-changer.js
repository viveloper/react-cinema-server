const fs = require('fs');
const path = require('path');

function changePosterUrl() {
  const targetFolder = '../data/ticketing/playSeqs/';
  fs.readdirSync(targetFolder).forEach((fileName) => {
    const targetFilePath = targetFolder + fileName;
    const jsonData = fs.readFileSync(targetFilePath);
    const playSeqsData = JSON.parse(jsonData);

    playSeqsData.PlaySeqs.Items.forEach((item) => {
      item.PosterURL = item.PosterURL.replace(
        'http://caching.lottecinema.co.kr/',
        ''
      );
    });

    fs.writeFileSync(
      path.resolve(__dirname, targetFilePath),
      JSON.stringify(playSeqsData)
    );

    console.log(targetFilePath);
  });
}

changePosterUrl();
