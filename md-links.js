const fs = require('fs/promises');
const path = require('path');
const access = fs.access;
const constants = fs.constants;

// const markDownExtensions = [
//   '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
// ];

const fileExists = (filePath) => access(filePath, constants.F_OK);
// .catch((err) => reject(new Error(err.message)));

const mdlinks = (thePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof thePath !== 'string' || thePath === '') {
        reject(new TypeError('The path is invalid'));
      }
      const absolutePath = path.resolve(thePath);
      fileExists(absolutePath)
          .then(() => resolve(absolutePath))
          .catch((err) => reject(new Error('No such file or directory')));
    } catch (err) {
      reject(new Error(err.message));
    }
  });
};

// const thePath = 200;
// const thePath = './somes/example.md';
// const thePath = './somes/example.md';
// mdlinks(thePath)
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
