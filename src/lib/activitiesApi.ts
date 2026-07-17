import type { Activity } from '../types';
import { supabase } from './supabaseClient';

type ActivityRow = {
  id: string;
  missionary_id: string;
  school_name: string;
  school_address: string;
  contact_person_name: string;
  contact_phone_number: string;
  event_date: string;
  session_count: number | null;
  session_timing: string;
  audience_age_range: string;
  audience_education_level: string;
  attendee_count: number | null;
  lecture_topic: string;
  responsible_collaborator: string;
  cost: number | null;
  location: string;
  created_at: string;
  updated_at: string;
};

const fromRow = (r: ActivityRow): Activity => ({
  id: r.id,
  missionaryId: r.missionary_id,
  schoolName: r.school_name,
  schoolAddress: r.school_address,
  contactPersonName: r.contact_person_name,
  contactPhoneNumber: r.contact_phone_number,
  eventDate: r.event_date,
  sessionCount: r.session_count ?? '',
  sessionTiming: r.session_timing,
  audienceAgeRange: r.audience_age_range,
  audienceEducationLevel: r.audience_education_level,
  attendeeCount: r.attendee_count ?? '',
  lectureTopic: r.lecture_topic,
  responsibleCollaborator: r.responsible_collaborator,
  cost: r.cost ?? '',
  location: r.location,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toRow = (a: Activity) => ({
  id: a.id,
  missionary_id: a.missionaryId,
  school_name: a.schoolName,
  school_address: a.schoolAddress,
  contact_person_name: a.contactPersonName,
  contact_phone_number: a.contactPhoneNumber,
  event_date: a.eventDate,
  session_count: a.sessionCount === '' ? null : a.sessionCount,
  session_timing: a.sessionTiming,
  audience_age_range: a.audienceAgeRange,
  audience_education_level: a.audienceEducationLevel,
  attendee_count: a.attendeeCount === '' ? null : a.attendeeCount,
  lecture_topic: a.lectureTopic,
  responsible_collaborator: a.responsibleCollaborator,
  cost: a.cost === '' ? null : a.cost,
  location: a.location,
});

export function newId(): string { return crypto.randomUUID(); }

export async function adminGetActivities(): Promise<Activity[]> {
  const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ActivityRow[]).map(fromRow);
}

export async function adminGetActivitiesByMissionary(missionaryId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('missionary_id', missionaryId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ActivityRow[]).map(fromRow);
}

export async function adminSaveActivity(record: Activity): Promise<Activity> {
  const { data, error } = await supabase.from('activities').upsert(toRow(record)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as ActivityRow) : record;
}

export async function adminDeleteActivity(id: string): Promise<void> {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetActivityStats() {
  const { count, error } = await supabase.from('activities').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return { total: count ?? 0 };
}
