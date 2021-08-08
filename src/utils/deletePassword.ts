import readPassFile from "./readPassFile";
import writePassFile from "./writePassFile";
import os from 'os';

const deletePassword = (key: string, useName:boolean) => {
  const data = readPassFile();
  const lines = data.split(os.EOL);
  let found: boolean = false;
  const filteredLines = lines.filter((line, index) => {
    const ret = useName ? line.split(':')[0] !== key : index !== Number(key);
    if (ret) {
      found = true;
    }
    return ret;
  });
  if (!found) {
    return false;
  }
  const newFileData = filteredLines.join(os.EOL)
  writePassFile(newFileData);
  return true;
}

export default deletePassword;
