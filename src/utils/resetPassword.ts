import os from 'os';
import readPassFile from './readPassFile';
import writePassFile from './writePassFile';

const resetPassword = (key: string, newPass: string, useName: boolean) => {
  const data = readPassFile();
  const lines = data.split(os.EOL);
  let found:boolean = false;
  const newLines = lines.map((line, index) => {
    const sLine = line.split(':');
    if (sLine.length !== 2) {
      return '';
    }
    let f;
    if (useName) {
      f = sLine[0] === key
      sLine[1] = f ? newPass : sLine[1];
    } else {
      f = index === Number(key)
      sLine[1] = f ? newPass : sLine[1];
    }
    if (f) {
      found = true;
    }
    return sLine.join(':');
  })
  if (!found) {
    return false;
  }
  const newFileData = newLines.join(os.EOL);
  writePassFile(newFileData);
  return true;
}

export default resetPassword;
