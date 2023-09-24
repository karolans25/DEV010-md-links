#!/usr/bin/env node

// console.log(process.argv); => this is the answer and why the two firsts are ignored
// [
//     '/home/karolans/.nvm/versions/node/v18.16.1/bin/node',
//     '/home/karolans/Documents/Github/Laboratoria/Bootcamp/Project_04/DEV010-md-links/cli.js',
//     'home'
// ]

const { mdlinks } = require('./md-links');

// const [, , ...args] = process.argv;
const args = process.argv.splice(2);

if (args.length === 1) {
  mdlinks(args[0]).then((res) => {
    res.forEach((element) => {
      console.log(args[0], element.href, element.text);
    });
  }).catch((err) => console.log(err));
} else if (args[1] === '--validate' && args.length === 2) {
  mdlinks(args[0], true).then((res) => console.log(res, res.length));
} else if (args[1] === '--stats') {
  // mdlinks(args[0], true).then((res) => console.log(res, res.length));
  console.log('stats');
} else {
  console.log('validate and stats');
}
