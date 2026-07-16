import type { Moballagh } from '../types';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function getAll(): Moballagh[] {
  return loadJSON<Moballagh[]>(STORAGE_KEYS.moballeghin, []);
}

export function newId(): string {
  return 'mob' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function registerMoballagh(data: Omit<Moballagh, 'id' | 'registeredAt'>): Promise<Moballagh> {
  await delay(400);
  const record: Moballagh = {
    ...data,
    id: newId(),
    registeredAt: new Date().toISOString(),
  };
  const all = getAll();
  all.push(record);
  saveJSON(STORAGE_KEYS.moballeghin, all);
  return record;
}

export async function adminGetMoballeghin(): Promise<Moballagh[]> {
  return [...getAll()].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
}

export async function adminSaveMoballagh(record: Moballagh): Promise<Moballagh> {
  const all = getAll();
  const idx = all.findIndex((m) => m.id === record.id);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  saveJSON(STORAGE_KEYS.moballeghin, all);
  return { ...record };
}

export async function adminDeleteMoballagh(id: string): Promise<void> {
  saveJSON(STORAGE_KEYS.moballeghin, getAll().filter((m) => m.id !== id));
}

export async function getMoballeghin(): Promise<Moballagh[]> {
  await delay(300);
  return [...getAll()].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
}

export async function adminGetMoballeghinStats() {
  const all = getAll();
  return { total: all.length, active: all.filter((m) => m.active).length };
}
