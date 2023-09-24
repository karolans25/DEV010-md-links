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

const arg = args[0].split('').splice(1).join('');
if (args.length === 1) {
  mdlinks(args[0]).then((res) => {
    // console.table(res.map((item) => ({ path: args[0], href: item.href, text: item.text })));
    res.forEach((element) => {
      const file = `${args[0]}${element.file.split(arg)[1]}`;
      console.log('%s\t%s\t%s', file, element.href, element.text);
    });
  }).catch(() => console.log('Error'));
} else if (args[1] === '--validate' && args.length === 2) {
  mdlinks(args[0], true).then((res) => {
    res.forEach((element) => {
      const file = `${args[0]}${element.file.split(arg)[1]}`;
      if (element.ok === 'ok') {
        // console.log('%s\t%s\t%s', file, element.href, element.text);
        console.log(`${file}\t${element.href}\t%c${element.ok} ${element.status}\t${element.text}`, 'color:green');
      } else {
        console.log(`${file}\t${element.href}\t%c${element.ok} ${element.status}\t${element.text}`, 'color:red');
      }
    });
  }).catch(() => console.log('Error'));
} else if (args[1] === '--stats') {
  // mdlinks(args[0], true).then((res) => console.log(res, res.length));
  console.log('stats');
} else {
  console.log('validate and stats');
}
