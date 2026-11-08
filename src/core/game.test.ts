import { describe, test, expect } from 'vitest';
import { createDigitValidator, isValidGuess, generateSecret, evaluateGuess, countPossibleSecrets } from './game.js';

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
    const mockRandom = () => mockValues[i++]!;

    const secret1 = generateSecret(4, 10, mockRandom);
    i = 0;
    const secret2 = generateSecret(4, 10, mockRandom);
    expect(secret1).toBe(secret2);
  });
});

describe('evaluateGuess', () => {
  test('тестирует частичное совпадение', () => {
    expect(evaluateGuess('0123', '0134')).toEqual({ bulls: 2, cows: 1 });
  });
  test('тестирует полное совпадение)', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  test('тестирует полную перестановку', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  test('тестирует отсутствие угаданной комбинации', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  test('нечувствительность к регистру (hex)', () => {
    expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 });
  });
});

describe('countPossibleSecrets', () => {
  test('возвращает 1 для длины 0 (пустой секрет)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  test('возвращает 0, если длина больше базы', () => {
    expect(countPossibleSecrets(5, 2)).toBe(0);
  });

  test('считает перестановки для dec (base=10)', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  test('считает перестановки для hex (base=16)', () => {
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });
});
