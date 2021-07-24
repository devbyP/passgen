// helper function to get data from "password.txt" in this project.
import fs from 'fs';
import { txtPath } from '../config';

const readPassFile = () => {
  // pass utf8 encode to get result as string type.
  return fs.readFileSync(txtPath, {encoding: 'utf8'});
}

export default readPassFile;
