import fs from 'fs';
import os from 'os';
import { txtPath } from '../config';

const writePassFile = (data:string) => {
  const senityCheck = data.split(os.EOL);
  let writeData = data;
  if (senityCheck[senityCheck.length - 1] !== '') {
    writeData = writeData + os.EOL;
  }
  fs.writeFileSync(txtPath, writeData, {encoding:'utf-8'});
}

export default writePassFile;
