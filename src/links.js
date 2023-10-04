const fs = require('fs');
const path = require('path');
const axios = require('axios');
const markdownIt = require('markdown-it');

const { statSync } = fs;
const { readFile } = fs.promises;

const {
  isMDFile, listAllMDFilesFromDirectory,
} = require('./files');
// const { mdlinks } = require('../md-links');
// const { stat } = require('fs/promises');

const md = markdownIt();

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

const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve, reject) => {
  try {
    const links = [];
    const linesFromMDFile = text.split('\n');
    const max = linesFromMDFile.length;
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
          link.status = res.status;
          link.ok = (res.ok === 'ok') ? res.ok : 'failed';
          return link;
        }));

      Promise.all(linksVerified).then((result) => {
        resolve(result);
      }).catch((err) => reject(err));
    } else {
      resolve(links);
    }
  } catch (err) {
    reject(err);
  }
});

const getLinksFromPath = (thePath, validate) => {
  let links = [];
  const absolutePath = path.resolve(thePath);

  let mdFiles = [];

  const statObject = statSync(absolutePath);
  console.log(statObject.isFile(), statObject.isDirectory());
  if (statObject.isFile()) {
    if (isMDFile(absolutePath)) {
      mdFiles.push(absolutePath);
    } else {
      return Promise.reject(new Error('It\'s a file but it\'s not a MD File'));
    }
  }
  if (statObject.isDirectory()) {
    mdFiles = listAllMDFilesFromDirectory(absolutePath, []);
  }
  links = mdFiles.map((route) => readFile(route, 'utf8')
    .then((text) => {
      links = getLinksFromHtml(route, text, validate);
      console.log(links);
      return links;
    })
    .catch((err) => err));

  return Promise.all(links)
    .then((result) => {
      links = result.flat();
      return links;
    })
    .catch((err) => err);
};

module.exports = {
  verifyUrl, getLinksFromHtml, getLinksFromPath,
};
