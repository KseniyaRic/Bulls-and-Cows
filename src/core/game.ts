import type { DigitValidator } from '../core/types.js';

export function createDigitValidator(base: number): DigitValidator {
  return (char) => {
    if (char.length !== 1) return false;
    const digit = parseInt(char.toLowerCase(), base);
    return !Number.isNaN(digit) && digit >= 0 && digit < base;
  };
}

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) return false;
  const isValidDigit = createDigitValidator(base);
  const chars = guess.toLowerCase().split('');
  const allValid = chars.every((char) => isValidDigit(char));
  if (!allValid) return false;
  const uniqueChars = new Set(chars);
  return chars.length === uniqueChars.size;
}
