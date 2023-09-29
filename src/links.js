const path = require('path');
const axios = require('axios');
const markdownIt = require('markdown-it');

const {
  listAllFiles, listAllMdFiles, readAFile,
} = require('./files');

const md = markdownIt({ linkify: true });

const verifyUrl = (url) => axios.get(url)
  .then((res) => {
    const data = {
      status: res.status,
      ok: (res.statusText === 'OK') ? 'ok' : 'fail',
    };
    return data;
  })
  .catch((err) => {
    const data = {
      status: (err.response) ? err.response.status : 500,
      ok: (err.response) ? err.response.statusText.toLowerCase() : 'failed',
    };
    return data;
  });

const getLinksFromHtml = (filePath, text, validate) => new Promise((resolve, reject) => {
  try {
    console.log(text);
    const links = [];
    const html = md.render(text);
    const lines = html.split('\n');
    const max = lines.length;
    for (let i = 0; i < max; i++) {
      // const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1>(.*?)<\/a>/g;
      // const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(?!#)(.*?)\1>(.*?)<\/a>/g;
      const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(?!\.\/|#)(.*?)\1>(.*?)<\/a>/g;

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
    if (validate) {
      const linksVerified = links.map((link) => verifyUrl(link.href)
        .then((res) => {
          link.status = res.status;
          // link.ok = res.ok;
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
  const files = listAllFiles(absolutePath);
  const mdFiles = listAllMdFiles(files);
  links = mdFiles.map((route) => readAFile(route)
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
