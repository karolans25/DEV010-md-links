#!/usr/bin/env node
const chalk = require('chalk');
const yargs = require('yargs');
const path = require('path');
const { mdlinks } = require('./md-links');

// Define las opciones booleanas sin valores
const options = yargs
  .usage(`\n${chalk.green.bold('Usage: $0 <./path/file/or/dir> [options]')}`)
  .option('validate', {
    describe: 'Validate the links',
    type: 'boolean',
  })
  .alias('V', 'validate')
  .option('stats', {
    describe: 'Show the stadistics',
    type: 'boolean',
  })
  .alias('s', 'stats')
  .help('h')
  .alias('help', 'h')
  .version()
  .alias('v', 'version')
  .argv;

// Ahora puedes acceder a las opciones en tu código
const { validate, stats } = options;
const currentPath = process.cwd();

if (validate || stats) {
  let output = '';
  mdlinks(options._[0], true).then((res) => {
    if (validate && stats) {
      output = `\nTotal:\t${res.length}\n`;
      const unique = [];
      const broken = [];
      res.forEach((element) => {
        if (!unique.includes(element.href)) unique.push(element.href);
        if (element.ok !== 'ok') broken.push(element.href);
      });
      output += `Unique:\t${unique.length}\nBroken:\t${broken.length}\n`;
      console.log(output);
    } else if (validate) {
      res.forEach((element) => {
        output += `${path.relative(currentPath, element.file)}\t${element.line}\t${element.href}`;
        if (element.ok === 'ok') {
          output += `\t${chalk.green.bold(element.ok)} ${chalk.green.bold(element.status)}`;
        } else if (element.ok === 'failed') {
          output += `\t${chalk.red.bold(element.ok)} ${chalk.red.bold(element.status)}`;
        }
        output += `\t${element.text.substr(0, 49)}\n`;
      });
      console.log(output);
    } else if (stats) {
      output = `\nTotal:\t${res.length}\n`;
      const unique = [];
      res.forEach((element) => {
        if (!unique.includes(element.href)) {
          unique.push(element.href);
        }
      });
      output += `Unique:\t${unique.length}\n`;
      console.log(output);
    }
  }).catch((err) => {
    output = `${chalk.red.bold(err.message)}`;
    console.log(output);
    console.log(`${chalk.yellow.underline('Write mdlinks -h to show help')}`);
  });
} else if (typeof options._[0] === 'undefined') {
  console.log(`${chalk.yellow.underline('Write mdlinks -h to show help')}`);
} else {
  mdlinks(options._[0]).then((res) => {
    let output = '';
    res.forEach((element) => {
      output += `${path.relative(currentPath, element.file)}\t${element.line}\t${element.href}\t${element.text.substr(0, 49)}\n`;
    });
    console.log(output);
  }).catch((err) => {
    const output = `${chalk.red.bold(err.message)}`;
    console.log(output);
    console.log(`${chalk.yellow.underline('Write mdlinks -h to show help')}`);
  });
}
