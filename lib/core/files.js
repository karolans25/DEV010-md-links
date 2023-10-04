const fs = require('fs');
const path = require('path');

const { statSync, readdirSync } = fs;
const { extname, join } = path;

const MARKDOWN_EXTENSIONS = [
  '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
];

/**
 * Indicates if a file path is a mardown file or not
 * @param {file} string The path of the file
 * @returns {boolean} Checks if the extension is for a markdown file
 */
const isMDFile = (file) => {
  const ext = extname(file);
  return MARKDOWN_EXTENSIONS.includes(ext);
};

/**
 * List the markdown files found in a directory and subdirectories
 * @param {thePath} string The string path of a directory
 * @param {allFiles} Array (recursive output) Array of string to keep the links
 * @returns {allFiles}
 */
const listAllMDFilesFromDirectory = (thePath, allFiles) => {
  try {
    const files = readdirSync(thePath);
    files.forEach((file) => {
      const absoluteRouteFile = join(thePath, file);
      // Check if the path is a File or a Directory
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
