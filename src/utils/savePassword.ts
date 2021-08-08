import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const savePassword = (password: string, name?: string) => {
  if (name?.charAt(0) === '.') {
    throw new Error('name cannot be ".".');
  }
  if (name?.includes(':') || name?.includes(os.EOL)) {
    throw new Error('Illegal character in name.');
  }
  if (!name) {
    name = '.';
  }
  const writeText = `${name}:${password}${os.EOL}`;
  const pathToFile = path.join(__dirname, '../../', 'password.txt');
  fs.open(pathToFile, 'a', 666, (e, id) => {
    fs.write(id, writeText, null, 'utf-8', () => {
      fs.close(id, () => {
        console.log(chalk.green('password has been save.'));
      });
    });
  });
}

export default savePassword;
