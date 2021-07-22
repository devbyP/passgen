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
  })

  test('length less than 8', () => {
    const generatedPassword = createPassword(4);
    expect(generatedPassword.length).toBe(8);
  })

});
