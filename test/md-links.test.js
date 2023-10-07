const MD_FILE_WHITHOUT_LINKS = '# Example\nThis is an example';

const MD_FILE_WHITH_LINKS = '# Markdown Links\n\n## Índice\n\n## 1. Preámbulo\n\n[Markdown](https://es.wikipedia.org/wiki/Markdownx) es un lenguaje de marcado [Markdown](https://es.wikipedia.org/wiki/Markdownx) \nligero muy popular entre developers. Es usado en \nmuchísimas plataformas que manejan texto plano (GitHub, foros, blogs, etc.) y \nes muy común encontrar varios archivos en ese formato en cualquier tipo de \nrepositorio (empezando por el tradicional `README.md`).\n\nEstos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que \nmuchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de \nla información que se quiere compartir.\n\nDentro de una comunidad de código abierto, nos han propuesto crear una \nherramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos \nen formato `Markdown`, para verificar los links que contengan y reportar \nalgunas estadísticas.\n\n![md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)';

const MD_LINKS = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18}]';

const MD_LINKS_VALIDATE = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18,"status":200,"ok":"ok"}]';

const URL = 'https://link_example.com';
const PATH = '/some/example';

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const fsP = require('fs').promises;
// const readFile = require('fs').promises;
const { mdlinks, verifyUrl, getLinksFromHtml } = require('../md-links');

jest.mock('path', () => ({
  resolve: jest.fn(),
  extname: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

jest.spyOn(fsP, 'readFile');

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

  it('should reject if absolute path doesn\'t exist', () => {
    const absolutePath = '/absolute/path';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(false);
    return expect(mdlinks(PATH)).rejects.toThrow(Error);
  });

  it('should reject if the path is a directory', async () => {
    try {
      const absolutePath = '/absolute/path';
      path.resolve.mockReturnValue(absolutePath);
      fs.existsSync.mockReturnValue(true);
      path.extname.mockReturnValue('');
      await mdlinks(PATH);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should reject if the path extension is an empty string', async () => {
    try {
      const absolutePath = '/absolute/path';
      path.resolve.mockReturnValue(absolutePath);
      fs.existsSync.mockReturnValue(true);
      path.extname.mockReturnValue('');
      await (mdlinks(PATH));
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should reject if the path is not a markdown file', () => {
    const absolutePath = '/absolute/path.txt';
    path.resolve.mockReturnValue(absolutePath);
    fs.existsSync.mockReturnValue(true);
    path.extname.mockReturnValue('.txt');
    return expect(mdlinks(PATH)).rejects.toThrow(Error);
  });

  it('should reject if the file is a markdown file but it can\'t be read', async () => {
    try {
      const absolutePath = '/absolute/path.md';
      path.resolve.mockReturnValue(absolutePath);
      path.extname.mockReturnValue('.md');
      fs.existsSync.mockReturnValue(true);
      fs.readFile.mockRejectValue(new Error(''));
      await mdlinks(PATH);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should resolve if the read md has no links', async () => {
    const absolutePath = '/absolute/path.md';
    path.resolve.mockReturnValue(absolutePath);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = '# Example\nThis is an example';
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(PATH);
    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf8');
    expect(res).toStrictEqual([]);
  });

  it('should resolve if the read md has some links', async () => {
    path.resolve.mockReturnValue(PATH);
    path.extname.mockReturnValue('.md');
    fs.existsSync.mockReturnValue(true);
    const expectedContents = MD_FILE_WHITH_LINKS;
    // eslint-disable-next-line max-len
    const mockReadFile = (fs.promises.readFile).mockImplementation(async () => Promise.resolve(expectedContents));
    // Mock md.render
    const res = await mdlinks(PATH);
    expect(mockReadFile).toHaveBeenCalledWith(PATH, 'utf8');
    expect(res).toStrictEqual(JSON.parse(MD_LINKS));
  });
});

describe('verifyUrl', () => {
  it('should be a function', () => {
    expect(typeof verifyUrl).toBe('function');
  });

  it('should return a data for a link verified as OK', async () => {
    const response = {
      status: 200,
      statusText: 'OK',
    };
    const dataOK = {
      status: 200,
      ok: 'ok',
    };
    axios.get.mockResolvedValue(response);
    const res = await verifyUrl(URL);
    expect(JSON.stringify(res)).toBe(JSON.stringify(dataOK));
  });

  it('should return a data for a link NOT verified as OK', async () => {
    const err = {
      response: {
        status: 404,
        statusText: 'NOT FOUND',
      },
    };
    const dataFailed = {
      status: 404,
      ok: 'not found',
    };
    axios.get.mockRejectedValue(err);
    const res = await verifyUrl(URL);
    expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
  });

  it('should return a default data (with status code 500) when exists a response but response.status or response.statusText are not defined', async () => {
    const response = {
    };
    const dataFailed = {
      status: 500,
      ok: 'failed',
    };
    axios.get.mockResolvedValue(response);
    const res = await verifyUrl(URL);
    expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
  });

  it('should return a default data when exists an error.response but error.response.status or error.response.statusText are not defined', async () => {
    const err = {
      response: {},
    };
    const dataFailed = {
      status: 500,
      ok: 'failed',
    };
    axios.get.mockRejectedValue(err);
    const res = await verifyUrl(URL);
    expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
  });

  it('should return a default data when exists an error but error.response is not defined', async () => {
    const err = {};
    const dataFailed = {
      status: 500,
      ok: 'failed',
    };
    axios.get.mockRejectedValue(err);
    const res = await verifyUrl(URL);
    expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
  });
});

describe('getLinksFromHTML', () => {
  it('should be a function', () => {
    expect(typeof getLinksFromHtml).toBe('function');
  });

  it('should be rejected with errors eith markdown', async () => {
    // md.render.mockReturnValue('');
    const res = await getLinksFromHtml(PATH, MD_FILE_WHITHOUT_LINKS);
    expect(res).toStrictEqual([]);
  });

  it('should return an empty array for a file without links', async () => {
    const res = await getLinksFromHtml(PATH, MD_FILE_WHITHOUT_LINKS);
    expect(res).toStrictEqual([]);
  });

  it('should return an array of objects for a file with some links', async () => {
    const res = await getLinksFromHtml(PATH, MD_FILE_WHITH_LINKS);
    expect(res).toStrictEqual(JSON.parse(MD_LINKS));
  });

  it('should return an array of objects for a file with some links validated', async () => {
    const response = {
      status: 200,
      statusText: 'OK',
    };
    const err = {
      response: {
        status: 404,
        statusText: 'NOT FOUND',
      },
    };
    axios.get.mockRejectedValueOnce(err);
    axios.get.mockRejectedValueOnce(err);
    axios.get.mockResolvedValue(response);

    const res = await getLinksFromHtml(PATH, MD_FILE_WHITH_LINKS, true);

    expect(res).toStrictEqual(JSON.parse(MD_LINKS_VALIDATE));
  });
});
