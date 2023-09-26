const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');

// const { access } = fs.promises;
// const { constants } = fs.promises;
const { stat } = fs.promises;
const { readFile } = fs.promises;
const { readdirSync } = fs;
const md = markdownIt({ linkify: true });

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const verifyUrl = (url) => fetch(url)
  .then((res) => {
    const data = {
      status: (typeof res.status === 'undefined') ? 404 : res.status,
      ok: (typeof res.statusText === 'undefined') ? 'fail' : res.statusText.toLowerCase(),
    };
    return data;
  })
  .catch((err) => {
    const data = {
      status: 500,
      ok: 'fail',
    };
    return data;
  });

const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve, reject) => {
  try {
    const links = [];
    const html = md.render(text);
    const lines = html.split('\n');
    const max = lines.length;
    for (let i = 0; i < max; i++) {
      const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1>(.*?)<\/a>/g;
      let match;
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
    if (validate) {
      const linksVerified = links.map((link) => verifyUrl(link.href)
        .then((res) => {
          link.status = res.status;
          // link.ok = res.ok;
          link.ok = (res.status === 200) ? res.ok : 'failed';
          return link;
        }));

      Promise.all(linksVerified).then((result) => {
        resolve(result);
      });
    } else {
      resolve(links);
    }
  } catch (err){
    reject(err);
  }
});

const fileExists = (filePath) => stat(filePath)
  .then(() => true).catch(() => false);
// .catch((err) => reject(new Error(err.message)));

const readAFile = (file) => readFile(file, 'utf8')
  .then((markdown) => markdown)
  .catch((err) => new Error(err.message));

const checkExtension = (fileNameArray) => {
  if (!(fileNameArray.length > 1)) {
    return false;
  }
  const ext = `.${fileNameArray.pop()}`;
  if (!markDownExtensions.includes(ext)) {
    return false;
  }
  return true;
};

const mdlinks = (thePath, validate) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
  }
  const absolutePath = path.resolve(thePath);
  fileExists(absolutePath)
    .then(() => {
      const ext = path.extname(absolutePath);
      if (ext === '') {
        reject(new Error('It\'s a directory'));
      }
      if (!markDownExtensions.includes(ext)) {
        reject(new Error('File is not a markdown file'));
      }
      readAFile(absolutePath)
        .then((text) => {
          const links = getLinksFromHtml(absolutePath, text, validate);
          resolve(links);
        })
        .catch((err) => reject(new Error('Couldn\'t read the file')));
    })
    .catch((err) => reject(new Error('No such file or directory')));

});

// const thePath = 200;
// const thePath = null;
// const thePath = './somes/example.md';
// const thePath = './some/example.txt';
// const thePath = './some/example.md';
// const thePath = './some/example1.md';
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md';
// const thePath = '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/README.md';
// const thePath = './some/';
// mdlinks(thePath, true)
  // .then((res) => console.log(res))
  // .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
