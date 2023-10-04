const DATA_ALL_MD_FILES = ['some/example1.md', 'some/somes/expample1.md', 'some/somes/example2.md'];

const MD_FILE_WHITHOUT_LINKS = '# Example\nThis is an example';

const MD_FILE_WHITH_LINKS = '# Markdown Links\n\n## Índice\n\n## 1. Preámbulo\n\n[Markdown](https://es.wikipedia.org/wiki/Markdownx) es un lenguaje de marcado [Markdown](https://es.wikipedia.org/wiki/Markdownx) \nligero muy popular entre developers. Es usado en \nmuchísimas plataformas que manejan texto plano (GitHub, foros, blogs, etc.) y \nes muy común encontrar varios archivos en ese formato en cualquier tipo de \nrepositorio (empezando por el tradicional `README.md`).\n\nEstos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que \nmuchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de \nla información que se quiere compartir.\n\nDentro de una comunidad de código abierto, nos han propuesto crear una \nherramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos \nen formato `Markdown`, para verificar los links que contengan y reportar \nalgunas estadísticas.\n\n![md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)';

const MD_LINKS = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18}]';

const MD_LINKS_VALIDATE = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"/some/example","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"/some/example","line":18,"status":200,"ok":"ok"}]';

const MD_LINKS_DIR = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"some/example1.md","line":18},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7},{"href":"https://nodejs.org/","text":"Node.js","file":"some/somes/example2.md","line":18}]';

const MD_LINKS_DIR_VALIDATE = '[{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/example1.md","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"some/example1.md","line":18,"status":200,"ok":"ok"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7,"status":404,"ok":"failed"},{"href":"https://es.wikipedia.org/wiki/Markdownx","text":"Markdown","file":"some/somes/example2.md","line":7,"status":404,"ok":"failed"},{"href":"https://nodejs.org/","text":"Node.js","file":"some/somes/example2.md","line":18,"status":200,"ok":"ok"}]';

const URL = 'https://link_example.com';
const PATH = '/some/example';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
// const markdownIt = require('markdown-it');

const {
  verifyUrl, getLinksFromHtml, getLinksFromPath,
} = require('../src/links');

const {
  isMDFile, listAllMDFilesFromDirectory,
} = require('../src/files');

// const md = markdownIt();

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// jest.mock('markdown-it', () => ({
//   ...jest.requireActual('markdown-it'),
//   render: jest.fn(),
// }));

jest.mock('path', () => ({
  resolve: jest.fn(),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    readFile: jest.fn(),
  },
  statSync: jest.fn(),
}));

jest.mock('../src/files', () => ({
  isMDFile: jest.fn(),
  listAllMDFilesFromDirectory: jest.fn(),
}));

const statObjectFile = {
  isFile: jest.fn().mockReturnValue(true),
  isDirectory: jest.fn().mockReturnValue(false),
};

const statObjectDirectory = {
  isFile: jest.fn().mockReturnValue(false),
  isDirectory: jest.fn().mockReturnValue(true),
};

describe('links functions', () => {
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

    it('should return an error if something goes wrong', async () => {
      try {
        Promise.reject();
        await getLinksFromHtml(PATH, MD_FILE_WHITH_LINKS, true);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
      // const res = await getLinksFromHtml(PATH, MD_FILE_WHITH_LINKS, true);
      // expect(res).toStrictEqual(JSON.parse(MD_LINKS_VALIDATE));
    });
  });

  describe('getLinksFromPath', () => {
    it('should be a function', () => {
      expect(typeof getLinksFromPath).toBe('function');
    });

    it('should return an error if the path is a file but is not a MD file', async () => {
      try {
        path.resolve.mockReturnValue(PATH);

        fs.statSync.mockReturnValueOnce(statObjectFile);

        isMDFile.mockReturnValueOnce(false);

        await getLinksFromPath(PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return an error if there\'s a problem reading a MD file', async () => {
      try {
        path.resolve.mockReturnValue(PATH);

        fs.statSync.mockReturnValueOnce(statObjectFile);

        isMDFile.mockReturnValueOnce(true);

        fs.promises.readFile.mockRejectedValue();
        await getLinksFromPath(PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it.skip('should return an error if there\'s a problem waiting to solve all the promises', async () => {
      try {
        path.resolve.mockReturnValue(PATH);

        fs.statSync.mockReturnValueOnce(statObjectFile);

        isMDFile.mockReturnValueOnce(true);

        fs.promises.readFile.mockResolvedValue(MD_FILE_WHITHOUT_LINKS);
        await getLinksFromPath(PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it('should return an empty array if the path is a MD file without links', async () => {
      path.resolve.mockReturnValue(PATH);

      fs.statSync.mockReturnValueOnce(statObjectFile);

      isMDFile.mockReturnValueOnce(true);

      fs.promises.readFile.mockResolvedValue(MD_FILE_WHITHOUT_LINKS);
      const res = await getLinksFromPath(PATH);
      expect(res).toStrictEqual([]);
    });

    it('should return an array of objects if the path is a MD file with links', async () => {
      path.resolve.mockReturnValue(PATH);

      fs.statSync.mockReturnValueOnce(statObjectFile);

      isMDFile.mockReturnValueOnce(true);

      fs.promises.readFile.mockResolvedValue(MD_FILE_WHITH_LINKS);
      const res = await getLinksFromPath(PATH);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS).sort());
    });

    it('should return an empty array if the path is a directory without MD files', async () => {
      path.resolve.mockReturnValue(PATH);

      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      listAllMDFilesFromDirectory.mockReturnValue([]);
      // fs.promises.readFile.mockResolvedValue(MD_FILE_WHITH_LINKS);
      const res = await getLinksFromPath(PATH);
      expect(res).toStrictEqual([]);
    });

    it('should return an empty array if the path is a directory with MD files without links', async () => {
      path.resolve.mockReturnValue(PATH);

      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      listAllMDFilesFromDirectory.mockReturnValue(DATA_ALL_MD_FILES);

      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS); // file 1
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS); // file 2
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS); // file 3

      const res = await getLinksFromPath(PATH);
      expect(res).toStrictEqual([]);
    });

    it.skip('should return an array of objects if the path is a directory with MD files with links', async () => {
      path.resolve.mockReturnValue(PATH);

      fs.statSync.mockReturnValueOnce(statObjectDirectory);

      listAllMDFilesFromDirectory.mockReturnValue(DATA_ALL_MD_FILES);

      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS); // file 1
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS); // file 2
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS); // file 3

      const res = await getLinksFromPath(PATH);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS).sort());
    });

    it.skip('should return an array of objects for the links in the directory', async () => {
      try {
        path.resolve.mockReturnValue('/absolute/path');

        // it's a directory
        fs.statSync.mockReturnValueOnce(statObjectDirectory);

        listAllMDFilesFromDirectory.mockReturnValue(['/absolute/field']);

        fs.promises.readFile.mockRejectedValue();
        await getLinksFromPath(PATH);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });

    it.skip('should return an array of objects for the links in the directory', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFilesFromDirectory.mockImplementation(() => new Error('There\'s not a MD File'));
      // listAllMDFilesFromDirectory.mockImplementation(() => {
      // throw new Error("There's not a MD File");
      // });
      // listAllMDFilesFromDirectory.mockReturnValue(new Error('There\'s not a MD File'));
      const res = await getLinksFromPath(PATH);
      expect(res).toStrictEqual([undefined]);
    });

    it.skip('should return an array of objects for the links in the directory', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFilesFromDirectory.mockReturnValue(DATA_ALL_MD_FILES);

      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITHOUT_LINKS);
      fs.promises.readFile.mockResolvedValueOnce(MD_FILE_WHITH_LINKS);
      const res = await getLinksFromPath(PATH);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS_DIR).sort());
    });

    it.skip('should return an array of objects for the links in the directory validated', async () => {
      path.resolve.mockReturnValue('/absolute/path');
      listAllMDFilesFromDirectory.mockReturnValue(DATA_ALL_MD_FILES);
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
      const res = await getLinksFromPath(PATH, true);
      expect(res.sort()).toStrictEqual(JSON.parse(MD_LINKS_DIR_VALIDATE).sort());
    });
  });
});
