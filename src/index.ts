#!/usr/bin/env node

// above shebang will find node binary in your system using env.

import { program } from 'commander';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import * as config from './config';
import savePassword from './utils/savePassword';
import createPassword from './utils/createPassword';
import getList from './utils/getList';
import getPassword from './utils/getPassword';

const log = console.log;

program.version(config.version).description(config.description);

const clip = (pass: string) => {
  clipboardy.writeSync(pass);
  log(chalk.yellow('password copy to clipboard.'))
}

program
  .command('regist')
  .description('save my password.')
  .argument('[password]')
  .option('-n, --name <name>', 'name the password.')
  .option('-c --clip', 'copy password to clipboard.')
  .action((password, options) => {
    const name = options.name ? options.name : '';
    if (!password) {
      inquirer.prompt({
        type: 'password',
        name: 'passprompt',
        message: 'input your password.'
      }).then((answer) => {
        if (typeof answer.passprompt !== 'string') {
          throw new Error('password need to be string.');
        }
        const pass = answer.passprompt;
        if (options.clip) {
          clip(pass);
        }
        savePassword(pass, name)
      })
    }
  })

program
  .command('generate')
  .description('generate new password.')
  .option('-l, --length <number>', 'length of password.', '10')
  .option('-s, --save', 'save password to passwords.txt.')
  .option('-nn, --no-number', 'remove number in password.')
  .option('-ns, --no-symbol', 'remove symbol in password.')
  .option('-nc, --no-capital', 'remove capital letter in password.')
  .option('--name <name>', 'name the password.')
  .option('--show', 'show password.')
  .action((options) => {
    const { length, number, symbol, capital, show, name, save } = options;
    const pass = createPassword(
      length,
      {hasCaps: capital, hasNumbers: number, hasSymbols: symbol}
    );
    if (show) {
      log(chalk.green(pass));
    }
    clip(pass);
    if (save) {
      savePassword(pass, name);
    }
  })

program
  .command('get')
  .description('get password from save storage.')
  .argument('<name>')
  .option('--show', 'show password.')
  .option('-c, --clip', 'copy password to clipboard.')
  .action((name, options) => {
    const password = getPassword(name);
    const sPassword = password.split(':');
    const passName = chalk.green(sPassword[0]);
    const showPass = ':' + chalk.blueBright(sPassword[1]);
    if (options.clip) {
      clip(sPassword[1]);
    }
    if (options.show) {
      log(passName + showPass);
    } else {
      log(passName);
    }
  });

/* program
  .command('reset')
  .description('reset password. cannot use if password name is not set.')
  .argument('<name>')
  .argument('[newpass]')
  .option('-g, --generate', 'new password using generate.')
  .option('-l, --length <number>', 'length of password.', '10')
  .option('-nn, --no-number', 'remove number in password.')
  .option('-ns, --no-symbol', 'remove symbol in password.')
  .option('-nc, --no-capital', 'remove capital letter in password.')
  .action((name, newpass, options) => {
    log()
  }); */

program
  .command('list')
  .description('list all password\'s name.')
  .option('--show', 'show password.')
  .action((options) => {
    const { show } = options;
    const { passwords, totalNoNamePassword } = getList();
    let indexLabel = 0;
    passwords.forEach((password, index) => {
      const sPassword = password.split(':');
      const noName = sPassword[0] === '.';
      const name = chalk.green('[' + indexLabel + '] ' + sPassword[0]);
      const showPass = ':' + chalk.blueBright(sPassword[1]);
      if (show) {
        log(name + showPass);
        indexLabel++;
      } else {
        if (!noName) {
          log(name);
          indexLabel++;
        }
      }
    });
    log(chalk.red(`total no name password: ${totalNoNamePassword}`));
  });

program.parse(process.argv);
