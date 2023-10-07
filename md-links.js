const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const axios = require('axios');

const fsP = fs.promises;
const { existsSync } = fs;
const { readFile } = fsP;
// const { stat } = fsP;
// const { access } = fsP;
// const { constants } = fsP;
const md = markdownIt({ linkify: true });

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const verifyUrl = (url) => axios.get(url)
  .then((res) => {
    const data = {
      status: res.status ? res.status : 500,
      ok: res.statusText === 'OK' ? 'ok' : 'failed',
    };
    return data;
  })
  .catch((err) => {
    let statusText = 'failed';
    let statusCode = 500;
    if (err.response) {
      if (err.response.statusText) {
        statusText = err.response.statusText.toLowerCase();
      }
      if (err.response.status) {
        statusCode = err.response.status;
      }
    }
    const data = {
      status: statusCode,
      ok: statusText,
    };
    return data;
  });

// const verifyUrl = (url) => fetch(url)
//   .then((res) => {
//     const data = {
//       status: res.status,
//       ok: (res.statusText === 'OK') ? 'ok' : 'fail',
//     };
//     return data;
//   })
//   .catch((err) => {
//     console.log(err);
//     const data = {
//       status: 500,
//       ok: 'fail',
//     };
//     return data;
//   });

const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve) => {
  const links = [];
  const linesFromMDFile = text.split('\n');
  const max = linesFromMDFile.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < max; i++) {
    const html = md.render(linesFromMDFile[i]);
    const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(?!\.\/|#)(.*?)\1>(.*?)<\/a>/g;
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(html)) !== null) {
      const link = {
        href: match[2],
        text: match[3],
        file: filePath,
        line: parseInt(i, 10) + 1,
      };
      links.push(link);
    }
  }
  if (validate) {
    const linksVerified = links.map((link) => verifyUrl(link.href)
      .then((res) => {
        // eslint-disable-next-line no-param-reassign
        link.status = res.status;
        // eslint-disable-next-line no-param-reassign
        link.ok = (res.ok === 'ok') ? res.ok : 'failed';
        return link;
      }));

    Promise.all(linksVerified).then((result) => {
      resolve(result);
    });
  } else {
    resolve(links);
  }
});

const mdlinks = (thePath, validate) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
  }
  const absolutePath = path.resolve(thePath);
  const exists = existsSync(absolutePath);
  if (!exists) {
    reject(new Error('No such file or directory'));
  }
  const extension = path.extname(absolutePath);
  if (extension === '') {
    reject(new Error('It\'s a directory'));
  }
  if (extension !== '' && !markDownExtensions.includes(extension)) {
    reject(new Error('File is not a markdown file'));
  }
  readFile(absolutePath, 'utf8')
    .then((text) => {
      const links = getLinksFromHtml(absolutePath, text, validate);
      resolve(links);
    });
});

// const thePath = 200;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// eslint-disable-next-line max-len
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md';
// eslint-disable-next-line max-len
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/README.md';
// mdlinks(thePath, true)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  verifyUrl, getLinksFromHtml, mdlinks,
};
