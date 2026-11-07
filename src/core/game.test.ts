import { describe, test, expect } from 'vitest';
import { createDigitValidator, isValidGuess } from './game.js';

describe('createDigitValidator', () => {
  test('base=10: принимает цифры, отвергает буквы', () => {
    const isValidDigit = createDigitValidator(10);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('7')).toBe(true);
    expect(isValidDigit('a')).toBe(false);
    expect(isValidDigit('A')).toBe(false);
  });
});

describe('isValidGuess', () => {
  test('проверяет необходимую длину', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
    expect(isValidGuess('A1b2', 4, 16)).toBe(true);
    expect(isValidGuess('012', 4, 10)).toBe(false);
    expect(isValidGuess('01234', 4, 10)).toBe(false);
  });

  test('проверяет на повторяющиеся цифры', () => {
    expect(isValidGuess('0112', 4, 10)).toBe(false);
    expect(isValidGuess('aA12', 4, 16)).toBe(false);
  });

  test('возвращает false, если есть символы вне базы', () => {
    expect(isValidGuess('012a', 4, 10)).toBe(false);
    expect(isValidGuess('0123', 4, 2)).toBe(false);
  });
});
