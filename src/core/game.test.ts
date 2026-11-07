import { describe, test, expect } from 'vitest';
import { createDigitValidator } from './game.js';

describe('createDigitValidator', () => {
  test('base=10: принимает цифры, отвергает буквы', () => {
    const isValidDigit = createDigitValidator(10);

    expect(isValidDigit('0')).toBe(true);
    expect(isValidDigit('7')).toBe(true);
    expect(isValidDigit('a')).toBe(false);
    expect(isValidDigit('A')).toBe(false);
  });
});
