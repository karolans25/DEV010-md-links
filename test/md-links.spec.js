const { mdlinks } = require('../md-links');


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

  it('should resolve with a valid type of path', () => {
    expect(mdlinks('/source')).resolves.toStrictEqual('/source');
  });
});
