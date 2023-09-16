const path = require('path');
const {mdlinks} = require('../md-links');

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdlinks).toBe('function');
  });

  it('should reject with an invalid type of path or empty string', () => {
    expect(mdlinks()).rejects.toThrow('The path is invalid');
    expect(mdlinks(null)).rejects.toThrow('The path is invalid');
    expect(mdlinks(undefined)).rejects.toThrow('The path is invalid');
    expect(mdlinks('')).rejects.toThrow('The path is invalid');
    expect(mdlinks(2)).rejects.toThrow('The path is invalid');
    expect(mdlinks([])).rejects.toThrow('The path is invalid');
    expect(mdlinks({}, null, undefined)).rejects.toThrow('The path is invalid');
  });

  it('should resolve with a path into an aboslute path', () => {
    jest.spyOn(path, 'resolve').mockImplementation((...args) => {
      return '/mocked/absolute/path';
    });
    expect(mdlinks('/source')).resolves.toStrictEqual('/mocked/absolute/path');
  });
});
