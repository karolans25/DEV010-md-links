const { stat } = require('fs').promises;
const { getLinksFromPath } = require('./src/links');

const mdlinks = (thePath, validate) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
  }

  stat(thePath).then(() => {
    getLinksFromPath(thePath, validate)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  }).catch(() => reject(new Error('No such file or directory')));
});

// const thePath = 200;
// const thePath = null;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// const thePath = './README.md';
// const thePath = './some/';
// mdlinks(thePath, true)
//   .then((res) => console.log(res, res.length))
//   .catch((err) => console.log(err.message));
// mdlinks(thePath)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
