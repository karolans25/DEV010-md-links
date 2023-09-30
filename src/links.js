const fs = require('fs');
const path = require('path');
const axios = require('axios');
const markdownIt = require('markdown-it');

const { readFile } = fs.promises;

const {
  listAllMDFiles,
} = require('./files');

const md = markdownIt();

const verifyUrl = (url) => axios.get(url)
  .then((res) => {
    const data = {
      status: res.status,
      ok: res.statusText === 'OK' ? 'ok' : 'failed',
    };
    return data;
  })
  .catch((err) => {
    const data = {
      status: err.response.status ? err.response.status : 500,
      ok: err.response.statusText ? err.response.statusText.toLowerCase() : 'failed',
    };
    return data;
  });

const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve, reject) => {
  try {
    const links = [];
    const linesFromMD = text.split('\n');
    const max = linesFromMD.length;
    for (let i = 0; i < max; i++) {
      const html = md.render(linesFromMD[i]);
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
      });
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
  const mdFiles = listAllMDFiles(absolutePath, []);
  links = mdFiles.map((route) => readFile(route, 'utf8')
    .then((text) => {
      links = getLinksFromHtml(route, text, validate);
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
