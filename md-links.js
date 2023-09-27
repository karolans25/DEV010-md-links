const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

const fsP = fs.promises;
const { existsSync } = fs;
const { readFile } = fsP;
// fsP.existsSync;
// const { stat } = fsP;
// const { access } = fsP;
// const { constants } = fsP;
const md = markdownIt({ linkify: true });

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

const getLinksFromHtml = (filePath, text) => new Promise((resolve, reject) => {
  try {
    const links = [];
    const html = md.render(text);
    const lines = html.split('\n');
    const max = lines.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < max; i++) {
      const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1>(.*?)<\/a>/g;
      let match;
      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(lines[i])) !== null) {
        const link = {
          href: match[2],
          text: match[3],
          file: filePath,
          line: parseInt(i, 10) + 1,
        };
        links.push(link);
      }
    }
    // if (validate) {
    //   const linksVerified = links.map((link) => verifyUrl(link.href)
    //     .then((res) => {
    //       link.status = res.status;
    //       link.ok = res.ok;
    //       return link;
    //     }));

    // Promise.all(linksVerified).then((result) => {
    //   resolve(result);
    // });
    // } else {
    //   resolve(links);
    // }
  } catch (err) {
    reject(new Error(err.message));
  }
});

const readAFile = (file) => readFile(file, 'utf8');

const fileExists = (filePath) => existsSync(filePath);

const mdlinks = (thePath, validate) => new Promise((resolve, reject) => {
  try {
    if (typeof thePath !== 'string' || thePath === '') {
      reject(new TypeError('The path is invalid'));
    }
    const absolutePath = path.resolve(thePath);
    const exists = fileExists(absolutePath);
    if (exists) {
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
          const links = getLinksFromHtml(absolutePath, text, validate);
          resolve(links);
        })
        .catch(() => reject(new Error('Couldn\'t read the file')));
    } else {
      reject(new Error('No such file or directory'));
    }
  } catch (err) {
    reject(new Error(err.message));
  }
});

// const thePath = 200;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// eslint-disable-next-line max-len
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/README.md';
// eslint-disable-next-line max-len
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md';
// mdlinks(thePath, true)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
