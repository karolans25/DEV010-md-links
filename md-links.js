const markDownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

const mdlinks = (thePath) => {
  return new Promise((resolve, reject) => {
    if (typeof thePath !== 'string' || thePath === ''){
      reject(new TypeError('The path is invalid'));
    }
    resolve(thePath);
  });
};

// const thePath = 200;
// const thePath = './some/example.md';
// mdlinks(thePath)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err.message));

module.exports = {
  mdlinks,
};
