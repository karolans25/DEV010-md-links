const fs = require('fs/promises');
const path = require('path');

const { access } = fs;
const { constants } = fs;
const { readFile } = fs;

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const fileExists = (filePath) => access(filePath, constants.F_OK);
// .catch((err) => reject(new Error(err.message)));

const readAFile = (file) => readFile(file, 'utf8')
  .then((markdown) => markdown)
  .catch((err) => new Error(err.message));

const mdlinks = (thePath) => new Promise((resolve, reject) => {
  try {
    if (typeof thePath !== 'string' || thePath === '') {
      reject(new TypeError('The path is invalid'));
    }
    const absolutePath = path.resolve(thePath);
    fileExists(absolutePath)
      .then(() => {
        const splitPath = absolutePath.split('/');
        const splitExt = splitPath.pop().split('.');
        if (splitExt.length <= 1 || splitExt[splitExt.length - 1] === '') {
          reject(new Error('It\'s a directory or invalid extension'));
        }
        const ext = `.${splitExt.pop()}`;
        if (!markDownExtensions.includes(ext)) {
          reject(new Error('File is not a markdown file'));
        }
        readAFile(absolutePath)
          .then((text) => {
            console.log(text);
            resolve(absolutePath);
          })
          .catch((err) => reject(new Error('Couldn\'t read the file')));
      })
      .catch((err) => reject(new Error('No such file or directory')));
  } catch (err) {
    reject(new Error(err.message));
  }
});

// const thePath = 200;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/';
// const thePath = './some/example.md';
// mdlinks(thePath)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
