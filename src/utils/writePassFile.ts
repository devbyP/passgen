import fs from 'fs';
import os from 'os';
import path from 'path';

const writePassFile = (data:string) => {
  const senityCheck = data.split(os.EOL);
  let writeData = data;
  if (senityCheck[senityCheck.length - 1] !== '') {
    writeData = writeData + os.EOL;
  }
  const passTxt = path.join(__dirname, '../../', 'password.txt');
  fs.writeFileSync(passTxt, writeData, {encoding:'utf-8'});
}

export default writePassFile;
