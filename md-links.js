const fs = require('fs/promises');
const path = require('path');
const access = fs.access;
const constants = fs.constants;

// const markDownExtensions = [
//   '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
// ];

// const fileExists = (filePath) => access(filePath, constants.F_OK)
//     .then(() => true)
//     .catch((err) => reject(new Error(err.message)));

const mdlinks = (thePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof thePath !== 'string' || thePath === '') {
        reject(new TypeError('The path is invalid'));
      }
      const absolutePath = path.resolve(thePath);
      resolve(absolutePath);
      // const exist = fileExists(absolutePath);
      // if (exist) {
      //   resolve(absolutePath);
      // } else {
      //   reject(new Error('The path doesn\'t exist'));
      // }
    } catch (err) {
      reject(new Error(err.message));
    }
  });
};

// const thePath = 200;
// const thePath = './some/example.md';
// mdlinks(thePath)
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
