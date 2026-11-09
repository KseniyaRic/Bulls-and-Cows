export type DigitValidator = (char: string) => boolean;
export type RandomFn = () => number;
export type Evaluation = {
  bulls: number;
  cows: number;
};
export type HistoryEntry = {
  guess: string;
  bulls: number;
  cows: number;
};

export type GameSettings = {
  length: number;
  base: number;
};

export type GameStatus = 'playing' | 'won';

export type GameState = {
  settings: GameSettings;
  secret: string;
  history: HistoryEntry[];
  status: GameStatus;
  startTime: number;
  endTime: number | null;
};

export type RecordEntry = {
  base: number;
  length: number;
  steps: number;
  timeMs: number;
  date: string;
};
