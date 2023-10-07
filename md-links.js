const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

const fsP = fs.promises;
const { existsSync } = fs;
const { readFile } = fsP;
const md = markdownIt({ linkify: true });

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const getLinksFromHtml = (filePath, text) => new Promise((resolve) => {
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
  resolve(links);
});

const mdlinks = (thePath) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
    return;
  }
  const absolutePath = path.resolve(thePath);
  const exists = existsSync(thePath);
  if (!exists) {
    reject(new Error('No such file or directory'));
    return;
  }
  const extension = path.extname(absolutePath);
  if (extension === '') {
    reject(new Error('Doesn\'t have extension or is a directory'));
    return;
  }
  if (extension !== '' && !markDownExtensions.includes(extension)) {
    reject(new Error('File is not a markdown file'));
    return;
  }
  readFile(absolutePath, 'utf8')
    .then((text) => {
      const links = getLinksFromHtml(absolutePath, text);
      resolve(links);
    });
});

// const thePath = 200;
// const thePath = '';
// const thePath = './somes';
// const thePath = './some/example';
// const thePath = './some/example.txt';
// const thePath = './some/';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// eslint-disable-next-line max-len
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/README.md';
// mdlinks(thePath, false)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));
// mdlinks(thePath, true)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
