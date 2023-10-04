const { existsSync } = require('fs');
const { getLinksFromPath } = require('./core/links');

/**
 * Search the links in a markdown file from a path
 * @param {thePath} string The string path for searching links
 * @param {validate} boolean (optional) Validate the links
 * @returns {Promise} The promise resolved or rejected
 */
const mdlinks = (thePath, validate) => new Promise((resolve, reject) => {
  if (typeof thePath !== 'string' || thePath === '') {
    reject(new TypeError('The path is invalid'));
  }

  if (!existsSync(thePath)) reject(new Error('No such file or directory'));

  getLinksFromPath(thePath, validate)
    .then((result) => {
      if (result.length === 0) {
        reject(new Error('There\'s no links'));
      }
      resolve(result);
    })
    .catch((err) => reject(err));
});

module.exports = {
  mdlinks,
};
