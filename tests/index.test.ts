import os from 'os';
import createPassword, { symbol, num, alpha } from '../src/utils/createPassword';

const isFound = (items: string, pass: string): boolean => {
  for (let i = 0; i < pass.length; i++) {
    if (items.includes(pass[i])) {
      return true;
    }
  }
  return false;
}
const hasSymbols = (pass: string): boolean => {
  return isFound(symbol, pass);
}
const hasCaps = (pass: string): boolean =>{
  return isFound(alpha.toUpperCase(), pass);
}
const hasNumber = (pass: string): boolean => {
  return isFound(num, pass);
}

describe('create password options', () => {

  test('default parameter.', () => {
    const generatedPassword = createPassword();
    expect(generatedPassword.length).toBe(10);
    expect(typeof generatedPassword).toBe('string');
    expect(hasSymbols(generatedPassword)).toBeTruthy();
    expect(hasCaps(generatedPassword)).toBeTruthy();
    expect(hasNumber(generatedPassword)).not.toBeFalsy();
  });

  test('with options', () => {
    const generatedPassword = createPassword(15, {
      hasNumbers: false,
      hasCaps: false,
      hasSymbols: false
    });
    expect(generatedPassword.length).toBe(15);
    expect(typeof generatedPassword).toBe('string');
    expect(hasSymbols(generatedPassword)).not.toBeTruthy();
    expect(hasCaps(generatedPassword)).not.toBeTruthy();
    expect(hasNumber(generatedPassword)).toBeFalsy();
  });

  test('length less than 8', () => {
    const generatedPassword = createPassword(4);
    expect(generatedPassword.length).toBe(8);
  });

});

import readPassFile from '../src/utils/readPassFile';

describe('file management.', () => {
  test('read data from password.txt', () => {
    expect(typeof readPassFile()).toBe('string');
  });

  test('last line of file is empty string.', () => {
    const data = readPassFile();
    const lines = data.split(os.EOL);
    // expect last line to be empty string.
    expect(lines[lines.length-1]).toBe('');
  });

  test('every line should have key and value.', () => {
    const data = readPassFile();
    const lines = data.split(os.EOL);
    let lengthNot2 = false
    for (let i = 0; i < lines.length - 1 && !lengthNot2; i++) {
      const line = lines[i].split(':');
      if (line.length !== 2) {
        lengthNot2 = true;
      }
    }
    expect(lengthNot2).toBeFalsy();
  });
});

import getList from '../src/utils/getList';

describe('get and list functionality.', () => {

  test('list totalNoNamePassword to be the same number as pasword name "."', () => {
    const { passwords, totalNoNamePassword } = getList();
    expect(Array.isArray(passwords)).toBeTruthy();
    expect(typeof totalNoNamePassword).toBe('number');
    expect(totalNoNamePassword).toBeGreaterThanOrEqual(0);
  });

});

import deletePassword from '../src/utils/deletePassword';
