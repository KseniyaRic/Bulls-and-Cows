import { describe, test, expect } from 'vitest';
import { createDigitValidator, isValidGuess, generateSecret } from './game.js';

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

describe('generateSecret', () => {
  test('генерирует секрет правильной длины и без повторов', () => {
    const secret = generateSecret(4, 10, () => 0);

    expect(secret).toHaveLength(4);
    expect(isValidGuess(secret, 4, 10)).toBe(true);
  });

  test('корректно обрабатывает лидирующие нули', () => {
    const secret = generateSecret(2, 10, () => 0);
    expect(secret[0]).toBe('0');
  });

  test('детерминированный результат при заданном random', () => {
    const mockValues = [0.3, 0.7, 0.2, 0.8];
    let i = 0;
    const mockRandom = () => mockValues[i++];

    const secret1 = generateSecret(4, 10, mockRandom);
    i = 0;
    const secret2 = generateSecret(4, 10, mockRandom);
    expect(secret1).toBe(secret2);
  });
});
