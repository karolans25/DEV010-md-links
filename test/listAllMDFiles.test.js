// eslint-disable-next-line max-len
// const DATA_LIST_DIR_GRANDMA = ['grandma/README.md', 'grandma/example3.md', 'grandma/example2.md', 'grandma/example1.txt', 'grandma/example', 'grandma/mom', 'grandma/aunt'];

// eslint-disable-next-line max-len
// const DATA_LIST_DIR_MOM = ['mom/example1.md', 'mom/example2.md', 'mom/example1.txt', 'mom/daughter'];

// const DATA_LIST_DIR_AUNT = ['aunt/example1.txt', 'aunt/example2.md'];

const DATA_ALL_MD_FILES = ['grandma/README.md', 'grandma/aunt/example2.md', 'grandma/example2.md', 'grandma/example3.md', 'grandma/mom/daughter/example0.md', 'grandma/mom/example1.md', 'grandma/mom/example2.md'];

// const fs = require('fs');
// const path = require('path');

const {
  listAllMDFiles,
} = require('../src/files');

// const markDownExtensions = [
//   '.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text',
// ];

const thePath = './grandma';
const mdFilePath = './grandma/README.md';
const filePath = './grandma/example1.txt';
// const statObject = {};

// jest.mock('path', () => ({
//   resolve: jest.fn(),
//   extname: jest.fn(),
// }));

// jest.mock('fs', () => ({
// existsSync: jest.fn(),
// readdirSync: jest.fn(),
// statSync: jest.fn().mockReturnValue(statObject),
// promises: {
//   readFile: jest.fn(),
// },
// }));

describe('files functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('listAllMDFiles', () => {
  //   it('should be a function', () => {
  //     expect(typeof readAFile).toBe('function');
  //   });
  //   it('should return the text if the file is read', async () => {
  //     const textMocked = 'Text content of a file';
  // eslint-disable-next-line max-len, max-len
  //     const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(textMocked));
  //     const res = await readAFile(thePath);
  //     expect(mockReadFile).toHaveBeenCalledWith(thePath, 'utf8');
  //     expect(res).toBe(textMocked);
  //   });
  //   it.skip('should return an error if the file is not read', async () => {
  // eslint-disable-next-line max-len, max-len
  //     const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.reject(new Error()));
  //     const res = await readAFile(thePath);
  //     expect(mockReadFile).toHaveBeenCalledWith(thePath, 'utf8');
  //     expect(res).toThrow(Error);
  //   });
  // });

  describe('listAllMDFiles', () => {
    it('should be a function', () => {
      expect(typeof listAllMDFiles).toBe('function');
    });
    it('should return an array with the list of markdown files\'s names ', () => {
      expect(listAllMDFiles(thePath, []).sort()).toStrictEqual(DATA_ALL_MD_FILES.sort());
    });
    it('should return an array with one element if the path is a md file ', () => {
      expect(listAllMDFiles(mdFilePath, [])).toStrictEqual([mdFilePath]);
    });
    it('should return an empty array if the path is a file but is not a md file ', () => {
      expect(listAllMDFiles(filePath, [])).toStrictEqual(new Error('The file is not a MD file'));
    });
  });
});
