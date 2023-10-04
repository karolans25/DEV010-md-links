# mdlinks // core

The modules found in `core/` should be modules that are specific to the domain logic of mdlinks. These modules would most likely not make sense to be consumed outside of the mdlinks module, as their logic is too specific. Some examples of core modules are:

- Find links from the path of a markdown file

    - Using `node` and uncomment the lines for `thePath` when the path is a file and for invocate the function with validate as the second optional parameter `true` or `false` for validating the url http states

    `$ node index.js`

    - Using the CLI `$ mdlinks -h` to see the options `--validate` or `-V`, `--stats` or `-s`, version of the library `--version` or `-v` and help with `--help` or `-h`

    `$ mdlinks './README.md'`

- Find links from the paths of markdown files found into a directory path
    
    - Using `node` and uncomment the lines for `thePath` when the path is a directory and for invocate the function with validate as the second optional parameter `true` or `false` for validating the url http states
    
    `$ node index.js`
    
    - Using the CLI `$ mdlinks -h` to see the options `--validate` or `-V`, `--stats` or `-s`, version of the library `--version` or `-v` and help with `--help` or `-h`
    
    `$ mdlinks './examples/'`
