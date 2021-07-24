import readPassFile from './readPassFile';
import os from 'os';

interface getListResult {
  totalNoNamePassword: number;
  passwords: string[]
}

const getList = (): getListResult => {
  const data = readPassFile();
  const lines = data.split(os.EOL);
  const passwordLineLength = lines[lines.length - 1] === '' ?
    lines.length - 1:
    lines.length;
  let undefindCount = 0;
  const passList: string[] = []
  for (let i = 0; i < passwordLineLength; i++) {
    const lSplit = lines[i].split(':');
    const noName = lSplit[0] === '.' || lSplit.length < 2;
    undefindCount = noName ? undefindCount + 1 : undefindCount;
    passList.push(lines[i]);
  }
  return {
    totalNoNamePassword: undefindCount,
    passwords: passList,
  }
}

export default getList;
