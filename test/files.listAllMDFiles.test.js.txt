const DATA_ALL_MD_FILES = ['grandma/README.md', 'grandma/aunt/example0.md', 'grandma/example2.md', 'grandma/example1.md', 'grandma/mom/daughter/example3.md', 'grandma/mom/example5.md', 'grandma/mom/example4.md'];

const {
  listAllMDFilesFromDirectory,
} = require('../src/files');

const thePath = './grandma';
const anotherPath = './grandma/mom/sister';
const mdFilePath = './grandma/README.md';
const filePath = './grandma/example1.txt';

describe('files functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listAllMDFilesFromDirectory', () => {
    it('should be a function', () => {
      expect(typeof listAllMDFilesFromDirectory).toBe('function');
    });

    it('should return an array with the list of markdown files\'s names ', () => {
      const res = listAllMDFilesFromDirectory(thePath, []);
      expect(res.sort()).toStrictEqual(DATA_ALL_MD_FILES.sort());
    });

    it('should return an empty array with a directory path without markdown files', () => {
      const res = listAllMDFilesFromDirectory(anotherPath, []);
      expect(res).toStrictEqual([]);
    });

    it('should return an error if the path is a file', () => {
      try {
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
