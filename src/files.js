const fs = require('fs');
const path = require('path');

const { statSync, readdirSync } = fs;
const { extname, join } = path;

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const isMDFile = (file) => {
  const ext = extname(file);
  return markDownExtensions.includes(ext);
};

// const getMDFiles = (files) => files.filter((file) => isMDFile(file));

const listAllMDFiles = (thePath, allFiles) => {
  const files = readdirSync(thePath);
  files.forEach((file) => {
    const absoluteRouteFile = join(thePath, file);
    const statObject = statSync(absoluteRouteFile);
    if (statObject.isFile() && isMDFile(absoluteRouteFile)) {
      allFiles.push(absoluteRouteFile);
    } else if (statObject.isDirectory()) {
      listAllMDFiles(absoluteRouteFile, allFiles);
    }
  });
  return allFiles;
};

module.exports = {
  listAllMDFiles,
};
