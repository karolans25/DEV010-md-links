const DATA_FILE = '# Markdown Links\n## Índice\n## 1. Preámbulo\n[Markdown](https://es.wikipedia.org/wiki/Markdownx) es un lenguaje de marcado\nligero muy popular entre developers. Es usado en\nmuchísimas plataformas que manejan texto plano (GitHub, foros, blogs, etc.) y\nes muy común encontrar varios archivos en ese formato en cualquier tipo de\nrepositorio (empezando por el tradicional `README.md`).\n\nEstos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que\nmuchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de\nla información que se quiere compartir.\n\nDentro de una comunidad de código abierto, nos han propuesto crear una\nherramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos\nen formato `Markdown`, para verificar los links que contengan y reportar\nalgunas estadísticas.\n![md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)';

const DATA_RESULT = '[{"file":"/absolute/path.md","href":"https://es.wikipedia.org/wiki/Markdownx","line":4,"text":"Markdown"},{"file":"/absolute/path.md","href":"https://nodejs.org/","line":13,"text":"Node.js"}]';

const DATA_RESULT_VALIDATE = '[{"file":"/absolute/path.md","href":"https://es.wikipedia.org/wiki/Markdownx","line":4, "ok":"not found","status";404,text":"Markdown"},{"file":"/absolute/path.md","href":"https://nodejs.org/","line":13,"ok":"ok","status";200,"text":"Node.js"}]';

const path = require('path');
const fs = require('fs');
// const axios = require('axios');
// const fsP = require('fs').promises;
// const readFile = require('fs').promises;
const { mdlinks } = require('../md-links');

jest.mock('path', () => ({
  resolve: jest.fn(),
  extname: jest.fn(),
}));

jest.mock('fs', () => ({
  // existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    stat: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// jest.mock('fs/promises');

// jest.mock('fs/promises', () => ({
//   readFile: jest.fn(),
// }));
// jest.spyOn(fsP, 'readFile');

const thePath = '/some/example';

describe('mdLinks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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

  it('should reject if absolute path doesn\'t exist', async () => {
    const absolutePath = '/absolute/path';
    path.resolve.mockReturnValue(absolutePath);
    const mockStat = (fs.promises.stat).mockImplementation(async () => Promise.reject());
    const res = await mdlinks(thePath);
    expect(mockStat).toHaveBeenCalledWith(absolutePath);
    expect(res).toThrow(Error);
  });

  // it.skip('should reject with an Error when file doesn\'t have an extension', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/example')).rejects.toThrow(Error);
  // });

  it('should reject if the path is not a markdown file and a directory neither', async () => {
    const absolutePath = '/absolute/path';
    path.resolve.mockReturnValue(absolutePath);
    const mockStat = (fs.promises.stat).mockImplementation(async () => Promise.resolved());
    path.extname.mockReturnValue('.txt');
    const res = await mdlinks(thePath);
    expect(mockStat).toHaveBeenCalledWith(absolutePath);
    expect(res).toThrow(Error);
    // fs.existsSync.mockReturnValue(true);
    // return expect(mdlinks(thePath)).rejects.toThrow(Error);
  });

  it('should reject if the path extension is an empty string', () => {
    const absolutePath = '/absolute/path.txt';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('');
    // fs.existsSync.mockReturnValue(true);
    return expect(mdlinks(thePath)).rejects.toThrow(Error);
    // return expect(mdlinks(thePath)).rejects.toThrow(Error);
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

  it('should reject if the file is a markdown file but it can\'t be read', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const error = new Error('Error reading the file');
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.reject(error));
    const res = await mdlinks(thePath);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).rejects.toThrow(Error);
  });

  it('should resolve if the read md has no links without validate', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(thePath);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).toStrictEqual([]);
  });

  it('should resolve if the read md has some links without validate', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = DATA_FILE;
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(thePath);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).toStrictEqual(JSON.parse(DATA_RESULT));
  });

  it('should resolve if the read md has no links with validate true', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(thePath, true);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).toStrictEqual([]);
  });

  it('should resolve if the read md has some links without validate true', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = DATA_FILE;
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(thePath, true);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).toStrictEqual(JSON.parse(DATA_RESULT_VALIDATE));
  });

  // it('readFile', async () => {
  //   const expectedContents = '# Example\nThis is an example';
  //   fsP.readFile = jest.fn().mockResolvedValue(expectedContents);
  //   const result = await fsP.readFile();
  //   expect(result).toBe(expectedContents);
  // });

  // it('should resolve with the file data when file is valid without links', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/example.md')).resolves.toStrictEqual([]);
  // });

  // it('should resolve with the file data when file is valid with some links', () => {
  //   expect.assertions(1);
  //   return expect(mdlinks('./some/example1.md')).resolves.toStrictEqual(JSON.parse(DATA_RESULT));
  // });
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
