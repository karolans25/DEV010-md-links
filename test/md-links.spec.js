const path = require('path');
const fsPromises = require('fs/promises');
const {mdlinks} = require('../md-links');

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdlinks).toBe('function');
  });

  it('should reject with an invalid type of path or empty string', async () => {
    await expect(mdlinks()).rejects.toThrow('The path is invalid');
    await expect(mdlinks(null)).rejects.toThrow('The path is invalid');
    await expect(mdlinks(undefined)).rejects.toThrow('The path is invalid');
    await expect(mdlinks('')).rejects.toThrow('The path is invalid');
    await expect(mdlinks(2)).rejects.toThrow('The path is invalid');
    await expect(mdlinks([])).rejects.toThrow('The path is invalid');
    await expect(mdlinks({}, null, undefined)).rejects.toThrow('The path is invalid');
  });

  it('should reject with an abs. path that doesn\'t exist on pc', async () => {
    jest.spyOn(path, 'resolve').mockImplementation((...args) => {
      return '/mocked/absolute/path';
    });
    const mockResponse = jest.fn().mockRejectedValue({message: 'reject'});
    jest.spyOn(fsPromises, 'access').mockResolvedValue(mockResponse);
    await expect(mdlinks('./source')).rejects.toThrow('No such file or directory');
  });

  it('should resolve with an abs. path that exists on pc', async () => {
    jest.spyOn(path, 'resolve').mockImplementation((...args) => {
      return '/mocked/absolute/path';
    });
    // const mockResponse = jest.fn().mockResolvedValue({message: 'resolve'});
    // jest.spyOn(fsPromises, 'access').mockResolvedValue(mockResponse);
    await expect(mdlinks('./some/example.md')).resolves.toStrictEqual('./some/example.md');
  });
});
