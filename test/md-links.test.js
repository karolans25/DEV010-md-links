// import { describe, expect, it } from '@jest/globals';
// const path = require('path');
// const fsPromises = require('fs/promises');
const { mdlinks } = require('../md-links');

const DATA_RESULT = '[{"file":"/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md","href":"https://es.wikipedia.org/wiki/Markdownx","line":4,"text":"Markdown"},{"file":"/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/some/example1.md","href":"https://nodejs.org/","line":13,"text":"Node.js"}]';

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

  it('should reject with a TypeError when file is not a valid string', () => {
    expect.assertions(1);
    return expect(mdlinks()).rejects.toThrow(TypeError);
  });

  it('should reject with an Error when file doesn\'t have an extension', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example')).rejects.toThrow(Error);
  });

  it('should reject with an Error when file has an invalid path', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/')).rejects.toThrow(Error);
  });

  it('should reject with an Error when file is not a markdown file', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example.js')).rejects.toThrow(Error);
  });

  it('should resolve with the file data when file is valid without links', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example.md')).resolves.toStrictEqual([]);
  });

  it('should resolve with the file data when file is valid with some links', () => {
    expect.assertions(1);
    return expect(mdlinks('./some/example1.md')).resolves.toStrictEqual(JSON.parse(DATA_RESULT));
  });
});
