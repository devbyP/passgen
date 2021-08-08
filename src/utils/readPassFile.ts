// helper function to get data from "password.txt" in this project.
import fs from 'fs';
import { txtPath } from '../config';

const readPassFile = () => {
  if (fs.existsSync(txtPath)) {
    // pass utf8 encode to get result as string type.
    return fs.readFileSync(txtPath, {encoding: 'utf8'});
  }
  console.log('password.txt file not exist.');
  console.log('create new password.txt file...')
  fs.closeSync(fs.openSync(txtPath, 'w'));
  console.log('password.txt file is created.')
  return '';
}

export default readPassFile;
