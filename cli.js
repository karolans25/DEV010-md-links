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
      console.log('%s\t%s\t%s', file, element.href, element.text.substr(0, 49));
    });
  }).catch(() => console.log('Error'));
} else if (args[1] === '--validate' && args.length === 2) {
  mdlinks(args[0], true).then((res) => {
    res.forEach((element) => {
      const file = `${args[0]}${element.file.split(arg)[1]}`;
      if (element.ok === 'ok') {
        // console.log('%s\t%s\t%s', file, element.href, element.text);
        console.log('%s\t%s\t%s\t%s', file, element.href, `${element.ok} ${element.status}`, element.text.substr(0, 49));
      } else {
        console.log('%s\t%s\t%s\t%s', file, element.href, `${element.ok} ${element.status}`, element.text.substr(0, 49));
      }
    });
  }).catch(() => console.log('Error'));
} else if (args[1] === '--stats') {
  mdlinks(args[0]).then((res) => {
    console.log('\nTotal: ', res.length);
    const links = [];
    res.forEach((element) => {
      if (!links.includes(element.href)) {
        links.push(element.href);
      }
    });
    console.log('Unique: ', links.length, '\n');
  }).catch(() => console.log('Error'));
} else {
  let broken = 0;
  mdlinks(args[0], true).then((res) => {
    console.log('\nTotal: ', res.length);
    const links = [];
    res.forEach((element) => {
      if (!links.includes(element.href)) {
        links.push(element.href);
      }
      if (element.ok === 'failed') {
        broken += 1;
      }
    });
    console.log('Unique: ', links.length);
    console.log('Broken: ', broken, '\n');
  }).catch(() => console.log('Error'));
}
