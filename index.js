const mdLinks = require('./lib/md-links');

// This module is intended to unwrap mdlinks default export as named.
const {
  mdlinks,
} = mdLinks;

// const thePath = 200;
// const thePath = null;
// const thePath = './REA';
// const thePath = './README.md';
// const thePath = './examples/grandma/example';
// const thePath = './examples/grandma/example1.txt';
// const thePath = './examples/';
// mdlinks(thePath, true)
//   .then((res) => console.log(res, res.length))
//   .catch((err) => console.log(err.message));

module.export = {
  mdlinks,
};
