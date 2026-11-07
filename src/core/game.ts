import type { DigitValidator, RandomFn } from '../core/types.js';

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

export function generateSecret(length: number, base: number, random: RandomFn = Math.random): string {
  const alphabet = '0123456789abcdef'.slice(0, base).split('');
  const availableDigits = [...alphabet];
  const secretChars: string[] = [];

  for (let i = 0; i < length; i++) {
    const r = random();

    const randomIndex = Math.floor(r * availableDigits.length);

    const pickedDigit = availableDigits[randomIndex];

    secretChars.push(pickedDigit!);

    availableDigits.splice(randomIndex, 1);
  }

  return secretChars.join('');
}
