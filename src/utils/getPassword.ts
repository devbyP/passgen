import readPassFile from "./readPassFile";
import os from 'os';

const getPassword = (name: string): string => {
  const data = readPassFile();
  const lines = data.split(os.EOL);
  let password = lines.find((line) => {
    const split = line.split(':');
    return split[0] === name;
  })
  if (!password) {
    //throw new Error('password not found.');
    password = '';
  }
  return password;
}

export default getPassword;
