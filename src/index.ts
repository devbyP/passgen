#!/usr/bin/env node

// above shebang will find node binary in your system using env.

import { program } from 'commander';
import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import * as config from './config';
import savePassword from './utils/savePassword';
import createPassword from './utils/createPassword';
import deletePassword from './utils/deletePassword';
import getList from './utils/getList';
import resetPassword from './utils/resetPassword';
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
      return inquirer.prompt({
        type: 'password',
        name: 'passprompt',
        message: 'input your password.'
      }).then((answer) => {
        const pass = answer.passprompt;
        if (typeof pass !== 'string') {
          throw new Error('password need to be text type.');
        }
        if (pass === '') {
          throw new Error('empty password.')
        }
        inquirer.prompt({
          type: 'password',
          name: 'confirmpassword',
          message: 'confirm your password.'
        }).then((answer) => {
          const confirm = answer.confirmpassword;
          if (typeof confirm !== 'string') {
            throw new Error('password need to be text type.');
          }
          if (pass !== confirm) {
            return log(chalk.redBright('fail confirm password.'))
          }
          if (options.clip) {
            clip(pass);
          }
          savePassword(pass, name);
        })
      }).catch((error) => {
        log(chalk.redBright(error.message));
      })
    }

    if (options.clip) {
      clip(password);
    }
    savePassword(password, name);
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
  .argument('<select>', 'search number. use -N for name search.')
  .option('--show', 'show password.')
  .option('-N, --name-search', 'search by name', false)
  .option('-d, --delete', 'delete selected password.')
  .option('-r, --reset', 'reset selected password.')
  .option('-c, --clip', 'copy password to clipboard.')
  .action((select, options) => {
    if (options.delete && options.reset) {
      throw new Error('cannot use both delete and reset at once. either use one or none.');
    }
    let fullPassword: [string, string] = ['', ''];
    if (!options.nameSearch) {
      const { passwords } = getList();
      const passwordLine = passwords[select];
      if (!passwordLine) {
        return log(chalk.redBright('password not found.'));
      }
      fullPassword = passwordLine.split(':') as [string, string];
    } else {
      const password = getPassword(select);
      if (!password) {
        log(chalk.redBright('password not found.'));
      }
      fullPassword = password.split(':') as [string, string];
    }
    if (options.delete) {
      return inquirer.prompt({
        type: 'confirm',
        name: 'confirmdelete',
        message: 'y/N',
        default: false
      }).then((answer) => {
        if (answer.confirmdelete) {
          const deleted = deletePassword(select, options.nameSearch);
          if (!deleted) {
            return log(chalk.redBright('fail to delete password.'));
          }
          return log(chalk.green('password not found.'));
        }
        return log(chalk.yellow('command reject.'));
      })
    }
    if (options.reset) {
      log(chalk.blueBright('reset password cannot be undo.'));
      log(chalk.blueBright('if you want to undo the change, you need to reset them manually.'))
      return inquirer.prompt({
        type: 'password',
        name: 'newpassword',
        message: 'input new password'
      }).then((answer) => {
        const newPass = answer.newpassword;
        if (typeof newPass !== 'string') {
          throw new Error('password need to be text type.');
        }
        if (newPass === '') {
          throw new Error('empty password');
        }
        return newPass;
      }).then((newPass) => {
        return inquirer.prompt({
          type: 'password',
          name: 'confirmpassword',
          message: 'confirm password'
        }).then((answer) => {
          if (typeof answer.confirmpassword !== 'string') {
            throw new Error('password need to be text type.');
          }
          if (answer.confirmpassword === newPass) {
            const reseted = resetPassword(select, newPass, options.nameSearch);
            if (!reseted) {
              return log(chalk.redBright('password not found.'));
            }
            return log(chalk.green('reset password completed.'));
          }
          return log(chalk.red('fail confirm password.'));
        })
      }).catch((error) => {
        log(chalk.redBright(error.message));
      })
      /* return inquirer.prompt({
        type: 'password',
        name: 'oldpassword',
        message: 'input old password',
      }).then((answer) => {
        if (answer.oldpassword === fullPassword[1]) {
          return inquirer.prompt({
            type: 'password',
            name: 'newpassword',
            message: 'input new password'
          }).then((answer) => {
            return answer.newpassword;
          }).then((newPass) => {
            return inquirer.prompt({
              type: 'password',
              name: 'confirmpassword',
              message: 'confirm password'
            }).then((answer) => {
              if (answer.confirmpassword === newPass) {
                resetPassword(select, newPass, options.nameSearch);
              } else {
                return log(chalk.red('fail confirm password.'));
              }
              log(chalk.green('reset password completed.'));
            })
          })
        }
        log(chalk.red('wrong password.'));
      }) */
    }
    const passName = chalk.green(fullPassword[0] === '.' ? 'Untitled password' : fullPassword[0]);
    const showPass = ':' + chalk.blueBright(fullPassword[1]);
    if (options.clip) {
      clip(fullPassword[1]);
    }
    if (options.show) {
      log(passName + showPass);
    } else {
      log(passName);
    }
  });

program
  .command('list')
  .description('list all password\'s name.')
  .option('--show', 'show password.')
  .action((options) => {
    const { show } = options;
    const { passwords, totalNoNamePassword } = getList();
    passwords.forEach((password, index) => {
      const sPassword = password.split(':');
      const noName = sPassword[0] === '.';
      const name = chalk.green('[' + index + '] ' + sPassword[0]);
      const showPass = ':' + chalk.blueBright(sPassword[1]);
      if (show) {
        log(name + showPass);
      } else {
        if (!noName) {
          log(name);
        }
      }
    });
    log(chalk.red('total no name password: ') + chalk.cyan(totalNoNamePassword));
  });

program.parse(process.argv);
