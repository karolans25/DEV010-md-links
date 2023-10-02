const fs = require('fs');
const path = require('path');
const axios = require('axios');
// const markdownIt = require('markdown-it');

const {
  verifyUrl, getLinksFromHtml, getLinksFromPath,
} = require('../src/links');

const {
  listAllMDFiles,
} = require('../src/files');

// const md = markdownIt({ linkify: true });

const theUrl = 'https://link_example.com';
const thePath = '/some/example';

const DATA_ALL_MD_FILES = ['some/example1.md', 'some/somes/expample1.md', 'some/somes/example2.md'];

const MD_FILE_WHITHOUT_LINKS = '# Example\nThis is an example';

const MD_FILE_WHITH_LINKS = '# Markdown Links\n\n## Índice\n\n## 1. Preámbulo\n\n[Markdown](https://es.wikipedia.org/wiki/Markdownx) es un lenguaje de marcado [Markdown](https://es.wikipedia.org/wiki/Markdownx) \nligero muy popular entre developers. Es usado en \nmuchísimas plataformas que manejan texto plano (GitHub, foros, blogs, etc.) y \nes muy común encontrar varios archivos en ese formato en cualquier tipo de \nrepositorio (empezando por el tradicional `README.md`).\n\nEstos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que \nmuchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de \nla información que se quiere compartir.\n\nDentro de una comunidad de código abierto, nos han propuesto crear una \nherramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos \nen formato `Markdown`, para verificar los links que contengan y reportar \nalgunas estadísticas.\n\n![md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)';

const MD_LINKS = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18}]';

const MD_LINKS_VALIDATE = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18,"status":200,"ok":"ok"}]';

const MD_LINKS_DIR = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"some/example1.md","line":18},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"some/somes/example2.md","line":18}]';

const MD_LINKS_DIR_VALIDATE = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"some/example1.md","line":18,"status":200,"ok":"ok"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"some/somes/example2.md","line":18,"status":200,"ok":"ok"}]';

// const statObject = {};

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// jest.mock('markdown-it', () => ({
//   render: jest.fn(),
// }));

jest.mock('path', () => ({
  resolve: jest.fn(),
  // extname: jest.fn(),
}));

jest.mock('fs', () => ({
//   // existsSync: jest.fn(),
//   readdirSync: jest.fn(),
//   statSync: jest.fn().mockReturnValue(statObject),
  promises: {
    readFile: jest.fn(),
  },
}));

jest.mock('../src/files', () => ({
  listAllMDFiles: jest.fn(),
}));

describe('links functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyUrl', () => {
    it('should be a function', () => {
      expect(typeof verifyUrl).toBe('function');
    });

    it('should return a data for a link verified OK', async () => {
      const response = {
        status: 200,
        statusText: 'OK',
      };
      const dataOK = {
        status: 200,
        ok: 'ok',
      };
      axios.get.mockResolvedValue(response);
      const res = await verifyUrl(theUrl);
      expect(JSON.stringify(res)).toBe(JSON.stringify(dataOK));
    });

    it('should return a data for a link not verified OK', async () => {
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
      const res = await verifyUrl(theUrl);
      expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
    });

    it('should return a default data when exists a response but it\'s not OK', async () => {
      const response = {
      };
      const dataOK = {
        status: 500,
        ok: 'failed',
      };
      axios.get.mockResolvedValue(response);
      const res = await verifyUrl(theUrl);
      expect(JSON.stringify(res)).toBe(JSON.stringify(dataOK));
    });

    it('should return a default data when exists an error.response but it\'s not defined', async () => {
      const err = {
        response: {},
      };
      const dataFailed = {
        status: 500,
        ok: 'failed',
      };
      axios.get.mockRejectedValue(err);
      const res = await verifyUrl(theUrl);
      expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
    });

    it('should return a default data when exists an error but response is not defined', async () => {
      const err = {};
      const dataFailed = {
        status: 500,
        ok: 'failed',
      };
      axios.get.mockRejectedValue(err);
      const res = await verifyUrl(theUrl);
      expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
    });
  });

  describe('getLinksFromHTML', () => {
    it('should be a function', () => {
      expect(typeof getLinksFromHtml).toBe('function');
    });

    it('should return an empty array for a file without links', async () => {
      const res = await getLinksFromHtml(thePath, MD_FILE_WHITHOUT_LINKS);
      expect(res).toStrictEqual([]);
    });

    it('should return an array of objects for a file with some links', async () => {
      const res = await getLinksFromHtml(thePath, MD_FILE_WHITH_LINKS);
      expect(res).toStrictEqual(JSON.parse(MD_LINKS));
    });

    it('should return an array of objects for a file with some links valdiated', async () => {
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

      const res = await getLinksFromHtml(thePath, MD_FILE_WHITH_LINKS, true);
      expect(res).toStrictEqual(JSON.parse(MD_LINKS_VALIDATE));
    });
  });

  describe('getLinksFromPath', () => {
    it('should be a function', () => {
      expect(typeof getLinksFromPath).toBe('function');
    });

    it('should return an array of objects for the links in the directory', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFiles.mockReturnValue(['/absolute/field']);

      fs.promises.readFile.mockRejectedValue();
      const res = await getLinksFromPath(thePath);
      expect(res).toStrictEqual([undefined]);
    });

    it('should return an array of objects for the links in the directory', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFiles.mockImplementation(() => new Error('There\'s not a MD File'));
      // listAllMDFiles.mockImplementation(() => {
      // throw new Error("There's not a MD File");
      // });
      // listAllMDFiles.mockReturnValue(new Error('There\'s not a MD File'));
      const res = await getLinksFromPath(thePath);
      expect(res).toStrictEqual([undefined]);
    });

    it('should return an array of objects for the links in the directory', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFiles.mockReturnValue(DATA_ALL_MD_FILES);

      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      const res = await getLinksFromPath(thePath);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS_DIR).sort());
    });

    it('should return an array of objects for the links in the directory validated', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFiles.mockReturnValue(DATA_ALL_MD_FILES);
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
      axios.get.mockResolvedValueOnce(response);
      axios.get.mockRejectedValueOnce(err);
      axios.get.mockRejectedValueOnce(err);
      axios.get.mockResolvedValue(response);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      const res = await getLinksFromPath(thePath, true);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS_DIR_VALIDATE).sort());
    });
  });
});
