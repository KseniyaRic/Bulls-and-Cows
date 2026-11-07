import type { DigitValidator } from '../core/types.js';

export function createDigitValidator(base: number): DigitValidator {
  return (char) => {
    if (char.length !== 1) return false;
    const digit = parseInt(char.toLowerCase(), base);
    return !Number.isNaN(digit) && digit >= 0 && digit < base;
  };
}
