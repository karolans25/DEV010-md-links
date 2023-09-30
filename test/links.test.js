// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const markdownIt = require('markdown-it');

const {
  verifyUrl, getLinksFromHtml, getLinksFromPath,
} = require('../src/links');

// const md = markdownIt({ linkify: true });

// const thePath = '/some/example';
// const statObject = {};

jest.mock('axios', () => ({
  get: jest.fn(),
}));

jest.mock('markdown-it', () => ({
  render: jest.fn(),
}));

// jest.mock('path', () => ({
//   resolve: jest.fn(),
//   extname: jest.fn(),
// }));

jest.mock('fs', () => ({
//   // existsSync: jest.fn(),
//   readdirSync: jest.fn(),
//   statSync: jest.fn().mockReturnValue(statObject),
  promises: {
    readFile: jest.fn(),
  },
}));

describe('links functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyUrl', () => {
    it('should be a function', () => {
      expect(typeof verifyUrl).toBe('function');
    });

    // it('should return a data for a link verified OK', async () => {
    //   const response = {
    //     status: 200,
    //     statusText: 'OK',
    //   };
    //   const dataOK = {
    //     status: 200,
    //     ok: 'ok',
    //   };
    //   axios.get.mockResolvedValue(response);
    //   const res = await verifyUrl(thePath);
    //   expect(JSON.stringify(res)).toBe(JSON.stringify(dataOK));
    // });

    // it('should return a data for a link not verified OK', async () => {
    //   const err = {
    //     response: {
    //       status: 404,
    //       statusText: 'NOT FOUND',
    //     },
    //   };
    //   const dataFailed = {
    //     status: 404,
    //     ok: 'not found',
    //   };
    //   axios.get.mockRejectedValue(err);
    //   const res = await verifyUrl(thePath);
    //   expect(JSON.stringify(res)).toBe(JSON.stringify(dataFailed));
    // });
  });

  describe('getLinksFromHTML', () => {
    it('should be a function', () => {
      expect(typeof getLinksFromHtml).toBe('function');
    });
    // it('should return an empty array for a file without links', async () => {
    //   // const textMd = '# Example\nThis is an example';
    //   const textHtml = '# Example\nThis is an example';
    //   md.render.mockReturnValue(textHtml);
    // });
  });

  describe('getLinksFromPath', () => {
    it('should be a function', () => {
      expect(typeof getLinksFromPath).toBe('function');
    });
  });
});
