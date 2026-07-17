import type { OrgUnit, OrgMember, OrgTreeNode, OrgSearchFilters } from '../types';
import { supabase } from './supabaseClient';

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));

type OrgUnitRow = {
  id: string;
  name: string;
  parent_id: string | null;
  order: number;
  active: boolean;
};

type OrgMemberRow = {
  id: string;
  parent_id: string | null;
  name: string;
  position: string;
  department: string;
  unit_id: string | null;
  management_level: string;
  image: string;
  bio: string;
  responsibilities: string[];
  education: string[];
  experience: string[];
  skills: string[];
  research_areas: string[];
  publications: string[];
  projects: string[];
  certificates: string[];
  awards: string[];
  phone: string;
  email: string;
  office: string;
  social_links: { label: string; url: string }[];
  gallery: string[];
  documents: string[];
  order: number;
  active: boolean;
};

const fromUnitRow = (r: OrgUnitRow): OrgUnit => ({
  id: r.id, name: r.name, parentId: r.parent_id, order: r.order, active: r.active,
});

const toUnitRow = (u: OrgUnit) => ({
  id: u.id, name: u.name, parent_id: u.parentId, order: u.order, active: u.active,
});

const fromMemberRow = (r: OrgMemberRow): OrgMember => ({
  id: r.id,
  parentId: r.parent_id,
  name: r.name,
  position: r.position,
  department: r.department,
  unitId: r.unit_id ?? '',
  managementLevel: r.management_level as OrgMember['managementLevel'],
  image: r.image,
  bio: r.bio,
  responsibilities: r.responsibilities ?? [],
  education: r.education ?? [],
  experience: r.experience ?? [],
  skills: r.skills ?? [],
  researchAreas: r.research_areas ?? [],
  publications: r.publications ?? [],
  projects: r.projects ?? [],
  certificates: r.certificates ?? [],
  awards: r.awards ?? [],
  phone: r.phone,
  email: r.email,
  office: r.office,
  socialLinks: r.social_links ?? [],
  gallery: r.gallery ?? [],
  documents: r.documents ?? [],
  order: r.order,
  active: r.active,
});

const toMemberRow = (m: OrgMember) => ({
  id: m.id,
  parent_id: m.parentId,
  name: m.name,
  position: m.position,
  department: m.department,
  unit_id: m.unitId || null,
  management_level: m.managementLevel,
  image: m.image,
  bio: m.bio,
  responsibilities: m.responsibilities,
  education: m.education,
  experience: m.experience,
  skills: m.skills,
  research_areas: m.researchAreas,
  publications: m.publications,
  projects: m.projects,
  certificates: m.certificates,
  awards: m.awards,
  phone: m.phone,
  email: m.email,
  office: m.office,
  social_links: m.socialLinks,
  gallery: m.gallery,
  documents: m.documents,
  order: m.order,
  active: m.active,
});

export function newId() { return crypto.randomUUID(); }

async function getUnits(): Promise<OrgUnit[]> {
  const { data, error } = await supabase.from('org_units').select('*');
  if (error) throw error;
  return (data as OrgUnitRow[]).map(fromUnitRow);
}

async function getMembers(): Promise<OrgMember[]> {
  const { data, error } = await supabase.from('org_members').select('*');
  if (error) throw error;
  return (data as OrgMemberRow[]).map(fromMemberRow);
}

export function buildOrgTree(members: OrgMember[]): OrgTreeNode[] {
  const active = members.filter((m) => m.active);
  const byParent = new Map<string | null, OrgMember[]>();
  for (const m of active) {
    const key = m.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(m);
  }
  const build = (parentId: string | null): OrgTreeNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children.sort((a, b) => a.order - b.order).map((m) => ({ ...m, children: build(m.id) }));
  };
  return build(null);
}

export function countDescendants(node: OrgTreeNode): number {
  return node.children.reduce((sum, c) => sum + 1 + countDescendants(c), 0);
}

export function flattenTree(nodes: OrgTreeNode[]): OrgTreeNode[] {
  const result: OrgTreeNode[] = [];
  const walk = (list: OrgTreeNode[]) => {
    for (const n of list) { result.push(n); if (n.children.length) walk(n.children); }
  };
  walk(nodes);
  return result;
}

export function findInTree(nodes: OrgTreeNode[], id: string): OrgTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findInTree(n.children, id);
    if (found) return found;
  }
  return null;
}

export function getAncestorIds(members: OrgMember[], id: string): Set<string> {
  const ids = new Set<string>();
  let current = members.find((m) => m.id === id);
  while (current && current.parentId) {
    ids.add(current.parentId);
    current = members.find((m) => m.id === current!.parentId);
  }
  return ids;
}

export function getDescendantIds(members: OrgMember[], id: string): Set<string> {
  const ids = new Set<string>();
  const collect = (pid: string) => {
    for (const m of members) {
      if (m.parentId === pid) { ids.add(m.id); collect(m.id); }
    }
  };
  collect(id);
  return ids;
}

export async function getOrgTree(): Promise<OrgTreeNode[]> {
  const members = await getMembers();
  return buildOrgTree(members);
}

export async function getOrgMemberById(id: string): Promise<OrgMember | null> {
  const { data, error } = await supabase.from('org_members').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromMemberRow(data as OrgMemberRow) : null;
}

export async function getOrgMembers(): Promise<OrgMember[]> {
  const members = await getMembers();
  return [...members].sort((a, b) => a.order - b.order);
}

export async function getOrgUnits(): Promise<OrgUnit[]> {
  const units = await getUnits();
  return [...units].sort((a, b) => a.order - b.order);
}

export async function getActiveOrgUnits(): Promise<OrgUnit[]> {
  const units = await getUnits();
  return units.filter((u) => u.active).sort((a, b) => a.order - b.order);
}

export async function getOrgFilterOptions(members: OrgMember[]) {
  const units = await getOrgUnits();
  return {
    departments: [...new Set(members.map((m) => m.department))].sort(),
    managementLevels: ['executive', 'deputy', 'department', 'unit', 'staff'],
    units: units.filter((u) => u.active).sort((a, b) => a.order - b.order),
  };
}

export function searchOrgMembers(members: OrgMember[], filters: OrgSearchFilters): Set<string> {
  const result = new Set<string>();
  for (const m of members) {
    if (!m.active) continue;
    const q = filters.query.trim();
    if (q && !(matches(m.name, q) || matches(m.position, q) || matches(m.department, q))) continue;
    if (filters.department && m.department !== filters.department) continue;
    if (filters.managementLevel && m.managementLevel !== filters.managementLevel) continue;
    if (filters.unitId && m.unitId !== filters.unitId) continue;
    result.add(m.id);
  }
  return result;
}

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

export async function adminGetOrgUnits(): Promise<OrgUnit[]> {
  const units = await getUnits();
  return [...units].sort((a, b) => a.order - b.order);
}

export async function adminSaveOrgUnit(unit: OrgUnit): Promise<OrgUnit> {
  const { data, error } = await supabase.from('org_units').upsert(toUnitRow(unit)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromUnitRow(data as OrgUnitRow) : unit;
}

export async function adminDeleteOrgUnit(id: string): Promise<void> {
  const { error } = await supabase.from('org_units').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetOrgMembers(): Promise<OrgMember[]> {
  const members = await getMembers();
  return [...members].sort((a, b) => a.order - b.order);
}

export async function adminSaveOrgMember(member: OrgMember): Promise<OrgMember> {
  const { data, error } = await supabase.from('org_members').upsert(toMemberRow(member)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromMemberRow(data as OrgMemberRow) : member;
}

export async function adminDeleteOrgMember(id: string): Promise<void> {
  const { error } = await supabase.from('org_members').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetOrgStats() {
  const [members, units] = await Promise.all([getMembers(), getUnits()]);
  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.active).length,
    totalUnits: units.length,
    activeUnits: units.filter((u) => u.active).length,
  };
}

export const emptyOrgMember = (): OrgMember => ({
  id: newId(), parentId: null, name: '', position: '', department: '', unitId: '',
  managementLevel: 'staff', image: '', bio: '', responsibilities: [], education: [],
  experience: [], skills: [], researchAreas: [], publications: [], projects: [],
  certificates: [], awards: [], phone: '', email: '', office: '', socialLinks: [],
  gallery: [], documents: [], order: 1, active: true,
});

export const emptyOrgUnit = (): OrgUnit => ({
  id: '', name: '', parentId: null, order: 1, active: true,
});
