const DATA_RESULT = '[{"file":"/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md","href":"https://es.wikipedia.org/wiki/Markdownx","line":4,"text":"Markdown"},{"file":"/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md","href":"https://nodejs.org/","line":13,"text":"Node.js"}]';

const path = require('path');
const fs = require('fs');
const fsP = require('fs').promises;
// const readFile = require('fs').promises;
const { mdlinks } = require('../md-links');

jest.mock('path', () => ({
  resolve: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));
// jest.mock('fs/promises');

// jest.mock('fs/promises', () => ({
//   readFile: jest.fn(),
// }));

const thePath = '/some/example';

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdlinks).toBe('function');
  });

  it('should reject with an invalid type of path, empty string  or without any argument', () => {
    expect(mdlinks()).rejects.toThrow('The path is invalid');
    expect(mdlinks(null)).rejects.toThrow('The path is invalid');
    expect(mdlinks(undefined)).rejects.toThrow('The path is invalid');
    expect(mdlinks('')).rejects.toThrow('The path is invalid');
    expect(mdlinks(2)).rejects.toThrow('The path is invalid');
    expect(mdlinks([])).rejects.toThrow('The path is invalid');
    expect(mdlinks({}, null, undefined, '')).rejects.toThrow('The path is invalid');
  });

  // it.skip('should reject with a TypeError when file is not a valid string', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks()).rejects.toThrow(TypeError);
  // });

  it('should reject if absolute path doesn\'t exist', () => {
    const absolutePath = '/absolute/path';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(false);
    return expect(mdlinks(thePath)).rejects.toThrow(Error);
  });

  // it.skip('should reject with an Error when file doesn\'t have an extension', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/example')).rejects.toThrow(Error);
  // });

  it('should reject if the path is a directory', () => {
    const absolutePath = '/absolute/path';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    return expect(mdlinks(thePath)).rejects.toThrow(Error);
  });

  // it.skip('should reject with an Error when file has an invalid path', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/')).rejects.toThrow(Error);
  // });

  // it.skip('should reject with an Error when file is not a markdown file', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/example.js')).rejects.toThrow(Error);
  // });

  it('should reject if the path is not a markdown file', () => {
    const absolutePath = '/absolute/path.txt';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    return expect(mdlinks(thePath)).rejects.toThrow(Error);
  });

  it('should reject if file can\'t be read', () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    fs.promises.readFile.mockRejectedValue(new Error('Can\'t read a file'));
    return expect(mdlinks(thePath)).rejects.toThrow(Error);
  });

  it.only('readFile', async () => {
    const expectedContents = '# Example\nThis is an example';
    fsP.readFile = jest.fn().mockResolvedValue(expectedContents);
    const result = await fsP.readFile();
    expect(result).toBe(expectedContents);
  });

  jest.spyOn(fsP, 'readFile');

  it.only('should resolve if file is read', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';
    // jest.spyOn(fsP, 'readFile').mockImplementation(() => Promise.resolve(expectedContents));
    // jest.spyOn(fsP, 'readFile').mockResolvedValue(expectedContents);
    // fsP.readFile = jest.fn().mockResolvedValue(expectedContents);
    fsP.readFile.mockResolvedValue(expectedContents);
    const result = await mdlinks(absolutePath);
    expect(result).toBe([]);
    expect(fs.readFile).toHaveBeenCalledWith(absolutePath, 'utf8');
  });

  test('Debería resolver la promesa con el contenido del archivo', () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';

    fsP.readFile = jest.fn().mockImplementation((file, encoding, callback) => {
      callback(null, expectedContents);
    });

    return mdlinks('archivo.md').then((result) => {
      expect(result).toBe(expectedContents);
    });
  });

  it('should resolve if file is read', () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';
    fsP.readFile = jest.fn().mockResolvedValue(expectedContents);

    // const mockMarkdown = 'Contenido del archivo markdown';
    return mdlinks('archivo.md').then((result) => {
      expect(result).toBe(expectedContents);
    });
  });

  it('Debería rechazar la promesa en caso de error en readFile', () => {
    const mockError = new Error('Error simulado');

    fs.readFile.mockImplementation((file, encoding, callback) => {
      callback(mockError, null);
    });

    return mdlinks('archivo.md').catch((error) => {
      expect(error).toBe(mockError);
    });
  });

  // it.skip('mdlinks should resolve if absolute path exists', () => {
  //   const absolutePath = '/absolute/path.md';
  //   path.resolve.mockReturnValue(absolutePath);
  //   fs.existsSync.mockReturnValue(true);
  //   return expect(mdlinks(thePath)).resolves.toBe(absolutePath);
  // });

  it.skip('should resolve with the file data when file is valid without links', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example.md')).resolves.toStrictEqual([]);
  });

  it.skip('should resolve with the file data when file is valid with some links', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example1.md')).resolves.toStrictEqual(JSON.parse(DATA_RESULT));
  });
});
/*
describe('mdLinks', () => {
// it.skip('should resolve with the file data when file is valid without links', () => {
//   expect.assertions(1);
//   return expect(mdlinks('./some/example.md')).resolves.toStrictEqual([]);
// });

// it.skip('should resolve with the file data when file is valid with some links', () => {
//   expect.assertions(1);
//   return expect(mdlinks('./some/example1.md')).resolves.toStrictEqual(JSON.parse(DATA_RESULT));
// });
// });
*/
