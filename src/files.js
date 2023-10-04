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

const listAllMDFilesFromDirectory = (thePath, allFiles) => {
  try {
    const files = readdirSync(thePath);
    files.forEach((file) => {
      const absoluteRouteFile = join(thePath, file);
      const statObject = statSync(absoluteRouteFile);
      if (statObject.isDirectory()) {
        listAllMDFilesFromDirectory(absoluteRouteFile, allFiles);
      }
      if (statObject.isFile()) {
        if (isMDFile(absoluteRouteFile)) {
          allFiles.push(absoluteRouteFile);
        }
      }
    });
    return allFiles;
  } catch (err) {
    return err;
  }
};

module.exports = {
  isMDFile, listAllMDFilesFromDirectory,
};
