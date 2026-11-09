import type { RecordEntry } from './core/types.js';

const STORAGE_KEY = 'bulls-and-cows-records';

export function saveRecord(record: RecordEntry): void {
  const records = loadRecords();
  records.push(record);
  records.sort((a, b) => a.timeMs - b.timeMs);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 10)));
}

export function loadRecords(): RecordEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RecordEntry[];
  } catch {
    return [];
  }
}

export function clearRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}
