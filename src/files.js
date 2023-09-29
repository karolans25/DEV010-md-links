const fs = require('fs');
const path = require('path');

const { statSync } = fs;

const markDownExtensions = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

const { readFile } = fs.promises;

const fileExists = (filePath) => statSync(filePath);

const readAFile = (file) => readFile(file, 'utf8')
  .then((markdown) => markdown)
  .catch((err) => err);

const checkExtension = (file) => {
  const ext = path.extname(file);
  if (!markDownExtensions.includes(ext)) return false;
  return true;
};

const listAllMdFiles = (files) => {
  const mdFiles = [];
  files.forEach((file) => {
    const isMd = checkExtension(file);
    if (isMd) {
      mdFiles.push(file);
    }
  });
  return mdFiles;
};

const listAllFiles = (thePath, allFiles = []) => {
  const files = fs.readdirSync(thePath);
  files.forEach((file) => {
    const routeFile = path.join(thePath, file);
    const statObject = fileExists(routeFile);
    if (statObject.isFile()) {
      allFiles.push(routeFile);
    } else if (statObject.isDirectory()) {
      listAllFiles(routeFile, allFiles);
    }
  });
  return allFiles;
};

module.exports = {
  fileExists, readAFile, checkExtension, listAllMdFiles, listAllFiles,
};
