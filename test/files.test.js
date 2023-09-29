// const DATA_FILES = ['file1.txt', 'file2.md', 'fil3.md', 'file4.js', 'some'];

const DATA_FILES_SUBDIR = ['file5.md', 'file6.txt', 'file7.md'];

// const DATA_MD_FILES = ['file2.md', 'fil3.md', 'some/file5.md', 'some/file7.md'];

const DATA_MD_FILES_SUBDIR = ['file5.md', 'file7.md'];

const fs = require('fs');
const path = require('path');

const {
  fileExists, readAFile, checkExtension, listAllMdFiles, listAllFiles,
} = require('../src/files');

// const markDownExtensions = [
//   '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
// ];

// const { readFile } = fs.promises;
const thePath = '/some/example';
const statObject = {};

jest.mock('path', () => ({
  resolve: jest.fn(),
  extname: jest.fn(),
}));

jest.mock('fs', () => ({
  // existsSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn().mockReturnValue(statObject),
  promises: {
    readFile: jest.fn(),
  },
}));

describe('files functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fileExist', () => {
    it('should be a function', () => {
      expect(typeof fileExists).toBe('function');
    });

    it('should return a statObject', () => {
      expect(fileExists(thePath)).toBe(statObject);
    });
    // What happen if a file doesn't exist
  });

  describe('readAFile', () => {
    it('should be a function', () => {
      expect(typeof readAFile).toBe('function');
    });
    it('should return the text if the file is read', async () => {
      const textMocked = 'Text content of a file';
      // eslint-disable-next-line max-len
      const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(textMocked));
      const res = await readAFile(thePath);
      expect(mockReadFile).toHaveBeenCalledWith(thePath, 'utf8');
      expect(res).toBe(textMocked);
    });
    it.skip('should return an error if the file is not read', async () => {
      // eslint-disable-next-line max-len
      const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.reject(new Error()));
      const res = await readAFile(thePath);
      expect(mockReadFile).toHaveBeenCalledWith(thePath, 'utf8');
      expect(res).toThrow(Error);
    });
  });

  describe('checkExtension', () => {
    it('should be a function', () => {
      expect(typeof checkExtension).toBe('function');
    });
    it('should return true if the file is markdown', async () => {
      path.extname.mockReturnValue('.md');
      expect(checkExtension(thePath)).toBeTruthy();
    });
    it('should return false if the file is not a markdown', async () => {
      path.extname.mockReturnValue('.txt');
      expect(checkExtension(thePath)).toBeFalsy();
    });
  });

  describe('listAllMdFiles', () => {
    it('should be a function', () => {
      expect(typeof listAllMdFiles).toBe('function');
    });
    it('should return an array with the list of markdown files\'s names ', () => {
      path.extname.mockReturnValueOnce('.md'); path.extname.mockReturnValueOnce('.txt');
      path.extname.mockReturnValueOnce('.md');
      expect(listAllMdFiles(DATA_FILES_SUBDIR)).toStrictEqual(DATA_MD_FILES_SUBDIR);
    });
  });

  describe('listAllFiles', () => {
    it('should be a function', () => {
      expect(typeof listAllFiles).toBe('function');
    });
    it.skip('should return an array with the list of files\'s names in the directory and subdirectories', () => {
    });
  });
});
