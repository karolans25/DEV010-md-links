const fs = require('fs');
const path = require('path');
// const markdownIt = require('markdown-it');

const fsP = fs.promises;
const { existsSync } = fs;
const readFile = fsP;
// fsP.existsSync;
// const { stat } = fsP;
// const { access } = fsP;
// const { constants } = fsP;
// const md = markdownIt({ linkify: true });

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

// const verifyUrl = (url) => fetch(url)
//   .then((res) => {
//     const data = {
//       status: res.status,
//       ok: res.statusText.toLowerCase(),
//     };
//     return data;
//   })
//   .catch((err) => err);

// const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve, reject) => {
//   try {
//     const links = [];
//     const html = md.render(text);
//     const lines = html.split('\n');
//     const max = lines.length;
//     for (let i = 0; i < max; i++) {
//       const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1>(.*?)<\/a>/g;
//       let match;
//       while ((match = regex.exec(lines[i])) !== null) {
//         const link = {
//           href: match[2],
//           text: match[3],
//           file: filePath,
//           line: parseInt(i, 10) + 1,
//         };
//         links.push(link);
//       }
//     }
//     if (validate) {
//       const linksVerified = links.map((link) => verifyUrl(link.href)
//         .then((res) => {
//           link.status = res.status;
//           link.ok = res.ok;
//           return link;
//         }));

//       Promise.all(linksVerified).then((result) => {
//         resolve(result);
//       });
//     } else {
//       resolve(links);
//     }
//   } catch (err) {
//     reject(new Error(err.message));
//   }
// });

const readAFile = (file) => readFile(file, 'utf8')
  .then((markdown) => markdown)
  .catch((err) => err);

const fileExists = (filePath) => existsSync(filePath);

const mdlinks = (thePath) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
  }
  const absolutePath = path.resolve(thePath);
  const exists = fileExists(absolutePath);
  if (!exists) {
    reject(new Error('No such file or directory'));
  }
  const splitPath = absolutePath.split('/');
  const splitExt = splitPath.pop().split('.');
  if (splitExt.length <= 1) {
    reject(new Error('It\'s a directory'));
  }
  const ext = `.${splitExt.pop()}`;
  if (ext !== '' && !markDownExtensions.includes(ext)) {
    reject(new Error('File is not a markdown file'));
  }
  readAFile(absolutePath)
    .then((text) => {
      console.log(text);
      resolve(absolutePath);
      // const links = getLinksFromHtml(absolutePath, text, validate);
      // resolve(links);
    })
    .catch((err) => reject(err));
});

// const thePath = 200;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// mdlinks(thePath, false)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));
// mdlinks(thePath, true)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
