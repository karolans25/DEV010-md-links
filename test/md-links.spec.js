const path = require('path');
const fsPromises = require('fs/promises');
const { mdlinks } = require('../md-links');

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
    spyOn(path, 'resolve').mockImplementation((...args) => '/mocked/absolute/path');
    const mockResponse = jest.fn().mockRejectedValue({ message: 'reject' });
    jest.spyOn(fsPromises, 'access').mockResolvedValue(mockResponse);
    await expect(mdlinks('./source')).rejects.toThrow('No such file or directory');
  });

  it('should reject the promise if the file doesn\'t exist', () => {
    const file = '../some/example.md';
    mdlinks(file).then((res) => {
      expect(fsPromises.access).toHaveBeenCalledWith(file, fsPromises.constants.F_OK);
      expect(fsPromises.readFile).toHaveBeenCalledWith('../some/example.md', 'utf8');
      expect(res).toBe('Mocked file contents');
    });
  });

  it('should reject the promise if the file doesn\'t have an extension', async () => {
    fsPromises.existsSync = jest.fn().mockReturnValue(true);
    path.resolve = jest.fn().mockReturnValue('/absolute/path/file/example');
    // jest.mock('split');
    // const mockSplit = jest.fn().mockReturnValue(['/absolute/path/file/example']);
    // const originalSplit = String.prototype.split;
    // String.prototype.split = mockSplit;

    // Call the function and assert the result
    // expect(splitString('Hello World')).toEqual(['Hello', 'World']);

    // Verify that the split function was called with the correct arguments
    // expect(mockSplit).toHaveBeenCalledWith(' ');

    // Restore the original split function
    // String.prototype.split = originalSplit;
    await expect(mdlinks('path/example')).rejects.toThrow('Invalid extension');
  });

  it('should reject the promise if the file ext. is not a markDown ext.', async () => {
    path.resolve = jest.fn().mockReturnValue('/absolute/path/file/example.txt');
    await expect(mdlinks('path/example')).rejects.toThrow('File is not a markdown file');
  });

  it('should resolve with an abs. path that exists on pc', async () => {
    jest.spyOn(path, 'resolve').mockImplementation(() => '/mocked/absolute/path');
    // const mockResponse = jest.fn().mockResolvedValue({message: 'resolve'});
    // jest.spyOn(fsPromises, 'access').mockResolvedValue(mockResponse);
    await expect(mdlinks('./some/example.md')).resolves.toStrictEqual('./some/example.md');
  });
});
