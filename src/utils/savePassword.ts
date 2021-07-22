import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const savePassword = (password: string) => {
  const pathToFile = path.join(__dirname, '../../', 'password.txt')
  fs.open(pathToFile, 'a', 666, (e, id) => {
    fs.write(id, password + os.EOL, null, 'utf-8', () => {
      fs.close(id, () => {
        console.log(chalk.green('password has been save.'));
      })
    });
  })
}

export default savePassword;
