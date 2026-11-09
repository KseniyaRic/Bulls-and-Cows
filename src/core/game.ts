import type { DigitValidator, RandomFn, Evaluation, HistoryEntry, GameState } from '../core/types.js';

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

export function evaluateGuess(secret: string, guess: string): Evaluation {
  const secretChars = secret.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');

  const bulls = secretChars.reduce((count, char, i) => {
    return count + (char === guessChars[i] ? 1 : 0);
  }, 0);

  const getCounts = (arr: string[]) =>
    arr.reduce<Record<string, number>>((acc, char) => {
      acc[char] = (acc[char] ?? 0) + 1;
      return acc;
    }, {});

  const secretCounts = getCounts(secretChars);
  const guessCounts = getCounts(guessChars);

  const common = Object.keys(secretCounts).reduce((total, char) => {
    return total + Math.min(secretCounts[char] as number, guessCounts[char] ?? 0);
  }, 0);

  const cows = common - bulls;

  return { bulls, cows };
}

const secretsCache = new Map<string, number>();

export function countPossibleSecrets(length: number, base: number): number {
  if (length === 0) return 1;
  if (length > base) return 0;
  if (length < 0 || base < 0) return 0;

  const cacheKey = `${length}-${base}`;
  if (secretsCache.has(cacheKey)) {
    return secretsCache.get(cacheKey)!;
  }

  const result = base * countPossibleSecrets(length - 1, base - 1);

  secretsCache.set(cacheKey, result);

  return result;
}

export function createInitialState(secret: string, length: number, base: number, now: number = Date.now()): GameState {
  return {
    secret,
    settings: { length, base },
    history: [],
    status: 'playing',
    startTime: now,
    endTime: null,
  };
}

export function addGuessToState(
  state: GameState,
  guess: string,
  bulls: number,
  cows: number,
  now: number = Date.now(),
): GameState {
  const newEntry: HistoryEntry = { guess, bulls, cows };

  const isWon = bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, newEntry],
    status: isWon ? 'won' : 'playing',
    endTime: isWon ? now : state.endTime,
  };
}
