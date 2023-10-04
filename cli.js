#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require('yargs');
const path = require('path');
const { mdlinks } = require('./lib/md-links');

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

let output = '';

const consoleError = (err) => {
  output = `\n${chalk.red.bold(err.message)}`;
  console.log(output);
  console.log(`\n${chalk.yellow.underline('Write mdlinks -h to show help')}\n`);
};

if (validate) {
  mdlinks(options._[0], true).then((res) => {
    if (stats) {
      const unique = [];
      const broken = [];
      res.forEach((element) => {
        if (!unique.includes(element.href)) unique.push(element.href);
        if (element.ok !== 'ok') broken.push(element.href);
      });
      output = `\nTotal:\t${res.length}\nUnique:\t${unique.length}\nBroken:\t${broken.length}\n`;
    } else {
      res.forEach((element) => {
        let validateText = '';
        if (element.ok === 'ok') {
          validateText = `\t${chalk.green.bold(element.ok)} ${chalk.green.bold(element.status)}`;
        } else if (element.ok === 'failed') {
          validateText = `\t${chalk.red.bold(element.ok)} ${chalk.red.bold(element.status)}`;
        }
        output += `${path.relative(currentPath, element.file)}\t${element.line}\t${element.href}\t${validateText}\t${element.text.substr(0, 49)}\n`;
      });
    }
    console.log(output);
  }).catch((err) => consoleError(err));
} else {
  mdlinks(options._[0], false).then((res) => {
    if (stats) {
      const unique = [];
      res.forEach((element) => {
        if (!unique.includes(element.href)) {
          unique.push(element.href);
        }
      });
      output = `\nTotal:\t${res.length}\nUnique:\t${unique.length}\n`;
    } else {
      res.forEach((element) => {
        output += `${path.relative(currentPath, element.file)}\t${element.line}\t${element.href}\t${element.text.substr(0, 49)}\n`;
      });
    }
    console.log(output);
  }).catch((err) => consoleError(err));
}
