export const alpha = 'abcdefghijklmnopqrstuvwxyz';
export const num = '0123456789';
export const symbol = '@#$%&*!_-^=+';

interface createPasswordOptions {
  hasNumbers?: boolean;
  hasSymbols?: boolean;
  hasCaps?: boolean;
}

const generatePassword = (length: number, charsSet: string | string[]): string => {
  function generateFromSet (attemp: number = 0): string {
    if (attemp > 10) {
      throw new Error('too many attemp. try again.');
    }
    let pass = '';
    let useSet = new Set();
    for (let i = 0; i < length; i++) {
      // structure ['abc', '!@#', '1234', 'ABC']
      // get one of the set char.
      const arrIndex = Math.floor(Math.random() * charsSet.length)
      const chosenOne = charsSet[arrIndex];
      // get character.
      pass += chosenOne.charAt(Math.floor(Math.random() * chosenOne.length));
      // add index to set.
      // this use to track the use of set.
      useSet.add(arrIndex);
    }
    if (useSet.size !== charsSet.length) {
      // Redo when not use all of the set.
      return generateFromSet(attemp + 1);
    }
    return pass;
  }
  let pass = '';
  if (typeof charsSet === 'string') {
    for (let i = 0; i < length; i++) {
      pass += charsSet.charAt(Math.floor(Math.random() * charsSet.length));
    }
  } else {
    pass = generateFromSet();
  }
  return pass;
}

const createPassword = (
  l?: number | createPasswordOptions,
  o?: createPasswordOptions
) => {
  let length = 10;
  let options = o || { hasCaps: true, hasNumbers: true, hasSymbols: true };
  if (typeof l === 'number') {
    length = l;
  } else if (typeof l === 'string') {
    length = parseInt(l)
  } else {
    if (l) options = l;
  }
  length = length < 8 ? 8 : length;

  const { hasCaps, hasNumbers, hasSymbols } = options;
  let chars = alpha;
  chars += hasCaps ? ' ' + alpha.toUpperCase() : '';
  chars += hasNumbers ? ' ' + num : '';
  chars += hasSymbols ? ' ' + symbol : '';
  const charsSet = chars.split(' ').length > 0 ? chars.split(' ') : chars;
  return generatePassword(length, charsSet);
}

export default createPassword;
