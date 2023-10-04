const DATA_ALL_MD_FILES = ['examples/grandma/README.md', 'examples/grandma/aunt/example0.md', 'examples/grandma/example2.md', 'examples/grandma/example1.md', 'examples/grandma/mom/daughter/example3.md', 'examples/grandma/mom/example5.md', 'examples/grandma/mom/example4.md'];

const fs = require('fs');
const path = require('path');

const {
  isMDFile, listAllMDFilesFromDirectory,
} = require('../lib/core/files');

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  extname: jest.fn(),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  statSync: jest.fn(),
}));

const thePath = './examples/grandma';
const anotherPath = './examples/grandma/mom/sister';
const mdFilePath = './examples/grandma/README.md';
const filePath = './examples/grandma/example1.txt';

const statObjectFile = {
  isFile: jest.fn().mockReturnValue(true),
  isDirectory: jest.fn().mockReturnValue(false),
};

const statObjectDirectory = {
  isFile: jest.fn().mockReturnValue(false),
  isDirectory: jest.fn().mockReturnValue(true),
};

describe('files functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isMDFile', () => {
    it('should be a function', () => {
      expect(typeof isMDFile).toBe('function');
    });

    it('should return true if the file is markdown', async () => {
      path.extname.mockReturnValue('.md');
      expect(isMDFile(thePath)).toBeTruthy();
    });

    it('should return false if the file is not a markdown', async () => {
      path.extname.mockReturnValue('.txt');
      expect(isMDFile(thePath)).toBeFalsy();
    });
  });

  describe('listAllMDFilesFromDirectory', () => {
    it('should be a function', () => {
      expect(typeof listAllMDFilesFromDirectory).toBe('function');
    });

    it('should return an array with the list of markdown files\'s names ', () => {
      // grandma/README.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // directory aunt
      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      // grandma/aunt/example0.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/aunt/example0.txt
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.txt');

      // grandma/example
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce(' ');

      // grandma/example1.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/example1.txt
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.txt');

      // grandma/example2.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/mom
      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      // grandma/mom/daughter
      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      // grandma/mom/daughter/example2.txt
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.txt');

      // grandma/mom/daughter/example3.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/mom/example3.txt
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.txt');

      // grandma/mom/example4.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/mom/example5.md
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.md');

      // grandma/mom/sister
      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      // grandma/mom/sister/example4.txt
      fs.statSync.mockReturnValueOnce(statObjectFile);
      path.extname.mockReturnValueOnce('.txt');

      // grandma/mom/sister/example5.txt
      fs.statSync.mockReturnValue(statObjectFile);
      path.extname.mockReturnValue('.txt');

      const res = listAllMDFilesFromDirectory(thePath, []);
      expect(res.sort()).toStrictEqual(DATA_ALL_MD_FILES.sort());
    });

    it('should return an empty array with a directory path without markdown files', () => {
      fs.statSync.mockReturnValue(statObjectFile);
      path.extname.mockReturnValue('.txt');
      const res = listAllMDFilesFromDirectory(anotherPath, []);
      expect(res).toStrictEqual([]);
    });

    it('should return an error if the path is a file', () => {
      try {
        fs.statSync.mockReturnValue(statObjectFile);
        path.extname.mockReturnValue('.txt');
        listAllMDFilesFromDirectory(filePath, []);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return an error if the path is a MD file', () => {
      try {
        listAllMDFilesFromDirectory(mdFilePath, []);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
