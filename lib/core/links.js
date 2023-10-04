const fs = require('fs');
const path = require('path');
const axios = require('axios');
const markdownIt = require('markdown-it');
const {
  isMDFile, listAllMDFilesFromDirectory,
} = require('./files');

const { statSync } = fs;
const { readFile } = fs.promises;

const md = markdownIt();

/**
 * HTTP query to identify the state of an url ('ok' or 'failed')
 * @param {url} string The url of a link
 * @returns {data} object with the code status and status text of the query
 */
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

/**
 * Check if there are links in the html text
 * @param {filePath} string The file path of the html text
 * @param {text} string The html text from markdown
 * @param {validate} boolean If the urls are validated or not
 * @returns {Promise} Resolved with an array of objects (links) or rejected
 */
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

/**
 * Search all the markdown files if the path is a directory.
 * Then read the markdown files and convert the content into html.
 * Finally look for links and the line where the link is found.
 * @param {filePath} string The file path for checking files and links
 * @param {validate} boolean (optional) If the urls are validated or not
 * @returns {links} Array of objects with the all the links from path
 */
const getLinksFromPath = (thePath, validate) => {
  let links = [];
  const absolutePath = path.resolve(thePath);

  let mdFiles = [];

  const statObject = statSync(absolutePath);
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
