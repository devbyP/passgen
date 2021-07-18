import commander from 'commander';
import * as config from './config'

const program = commander.program;

program.version(config.version).description(config.description);

program
  .option('-l, --length <number>', 'length of password.', '10')
  .option('-s, --save', 'save password to passwords.txt.')
  .option('-nn, --no-number', 'remove number in password.')
  .option('-ns, --no-symbol', 'remove symbol in password.')
  .option('-nc, --no-capital', 'remove capital letter in password.')
  .parse();

const log = console.log;

log(program.opts());
