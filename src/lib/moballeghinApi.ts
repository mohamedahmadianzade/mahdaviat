import type { Moballagh } from '../types';
import { supabase } from './supabaseClient';

type MoballaghRow = {
  id: string;
  full_name: string;
  father_name: string;
  id_card_number: string;
  national_code: string;
  birth_year: string;
  birth_place: string;
  education_level: string;
  marital_status: string;
  phone: string;
  bank_account_number: string;
  address: string;
  registered_at: string;
  active: boolean;
};

const fromRow = (r: MoballaghRow): Moballagh => ({
  id: r.id,
  fullName: r.full_name,
  fatherName: r.father_name,
  idCardNumber: r.id_card_number,
  nationalCode: r.national_code,
  birthYear: r.birth_year,
  birthPlace: r.birth_place,
  educationLevel: r.education_level as Moballagh['educationLevel'],
  maritalStatus: r.marital_status as Moballagh['maritalStatus'],
  phone: r.phone,
  bankAccountNumber: r.bank_account_number,
  address: r.address,
  registeredAt: r.registered_at,
  active: r.active,
});

const toRow = (m: Moballagh) => ({
  id: m.id,
  full_name: m.fullName,
  father_name: m.fatherName,
  id_card_number: m.idCardNumber,
  national_code: m.nationalCode,
  birth_year: m.birthYear,
  birth_place: m.birthPlace,
  education_level: m.educationLevel,
  marital_status: m.maritalStatus,
  phone: m.phone,
  bank_account_number: m.bankAccountNumber,
  address: m.address,
  registered_at: m.registeredAt,
  active: m.active,
});

export function newId(): string { return crypto.randomUUID(); }

export async function registerMoballagh(data: Omit<Moballagh, 'id' | 'registeredAt'>): Promise<Moballagh> {
  const id = newId();
  const registeredAt = new Date().toISOString();
  const row = toRow({ ...data, id, registeredAt });
  const { data: result, error } = await supabase.from('moballeghin').insert(row).select('*').maybeSingle();
  if (error) throw error;
  return result ? fromRow(result as MoballaghRow) : { ...data, id, registeredAt };
}

export async function adminGetMoballeghin(): Promise<Moballagh[]> {
  const { data, error } = await supabase.from('moballeghin').select('*').order('registered_at', { ascending: false });
  if (error) throw error;
  return (data as MoballaghRow[]).map(fromRow);
}

export async function adminSaveMoballagh(record: Moballagh): Promise<Moballagh> {
  const { data, error } = await supabase.from('moballeghin').upsert(toRow(record)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as MoballaghRow) : record;
}

export async function adminDeleteMoballagh(id: string): Promise<void> {
  const { error } = await supabase.from('moballeghin').delete().eq('id', id);
  if (error) throw error;
}

export async function getMoballeghin(): Promise<Moballagh[]> {
  const { data, error } = await supabase.from('moballeghin').select('*').order('registered_at', { ascending: false });
  if (error) throw error;
  return (data as MoballaghRow[]).map(fromRow);
}

export async function adminGetMoballeghinStats() {
  const { data, error } = await supabase.from('moballeghin').select('active');
  if (error) throw error;
  const rows = data as Pick<MoballaghRow, 'active'>[];
  return { total: rows.length, active: rows.filter((m) => m.active).length };
}
