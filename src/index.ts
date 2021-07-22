#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import * as config from './config';
import savePassword from './utils/savePassword';
import createPassword from './utils/createPassword';

const log = console.log;

program.version(config.version).description(config.description);

let pass: string = '';

program
  .command('regist')
  .description('save my password.')
  .argument('[password]')
  .option('-n, --name <name>', 'name the password.')
  .action((password, options) => {
    const name = options.name ? options.name : '';
    if (!password) {
      inquirer.prompt({type: 'password', name: 'passprompt',message: 'input your password.'}).then((answer) => {
        if (typeof answer.passprompt !== 'string') {
          throw new Error('password need to be string.');
        }
        pass = answer.passprompt;
      })
    }
  })

program
  //.command('generate')
  //.description('generate new password.')
  .option('-l, --length <number>', 'length of password.', '10')
  .option('-s, --save', 'save password to passwords.txt.')
  .option('-nn, --no-number', 'remove number in password.')
  .option('-ns, --no-symbol', 'remove symbol in password.')
  .option('-nc, --no-capital', 'remove capital letter in password.')
  .action((options) => {
    log(options);
  })

program
  .command('get')
  .argument('<name>')
  .description('get password from save storage.')
  .option('-s, --show', 'show password.')
  .option('-f --file <path>', 'get from selected file.')
  .action((name, option, command ) => {
    log(name, option, command.name());
  })

program.parse(process.argv);
