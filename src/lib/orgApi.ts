import type { OrgUnit, OrgMember, OrgTreeNode, OrgSearchFilters } from '../types';
import { defaultOrgUnits, defaultOrgMembers } from '../data/organization';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));

function getUnits(): OrgUnit[] { return loadJSON<OrgUnit[]>(STORAGE_KEYS.orgUnits, defaultOrgUnits); }
function getMembers(): OrgMember[] { return loadJSON<OrgMember[]>(STORAGE_KEYS.orgMembers, defaultOrgMembers); }

export function newId() { return 'm' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

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
  await delay(300);
  return buildOrgTree(getMembers());
}

export async function getOrgMemberById(id: string): Promise<OrgMember | null> {
  await delay(200);
  return getMembers().find((m) => m.id === id) ?? null;
}

export async function getOrgMembers(): Promise<OrgMember[]> {
  await delay(150);
  return [...getMembers()].sort((a, b) => a.order - b.order);
}

export async function getOrgUnits(): Promise<OrgUnit[]> {
  await delay(100);
  return [...getUnits()].sort((a, b) => a.order - b.order);
}

export async function getActiveOrgUnits(): Promise<OrgUnit[]> {
  await delay(100);
  return getUnits().filter((u) => u.active).sort((a, b) => a.order - b.order);
}

export function getOrgFilterOptions(members: OrgMember[]) {
  return {
    departments: [...new Set(members.map((m) => m.department))].sort(),
    managementLevels: ['executive', 'deputy', 'department', 'unit', 'staff'],
    units: getUnits().filter((u) => u.active).sort((a, b) => a.order - b.order),
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
  return [...getUnits()].sort((a, b) => a.order - b.order);
}

export async function adminSaveOrgUnit(unit: OrgUnit): Promise<OrgUnit> {
  const units = getUnits();
  const idx = units.findIndex((u) => u.id === unit.id);
  if (idx >= 0) units[idx] = unit; else units.push(unit);
  saveJSON(STORAGE_KEYS.orgUnits, units);
  return { ...unit };
}

export async function adminDeleteOrgUnit(id: string): Promise<void> {
  saveJSON(STORAGE_KEYS.orgUnits, getUnits().filter((u) => u.id !== id));
  const members = getMembers().map((m) => (m.unitId === id ? { ...m, unitId: '' } : m));
  saveJSON(STORAGE_KEYS.orgMembers, members);
}

export async function adminGetOrgMembers(): Promise<OrgMember[]> {
  return [...getMembers()].sort((a, b) => a.order - b.order);
}

export async function adminSaveOrgMember(member: OrgMember): Promise<OrgMember> {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === member.id);
  if (idx >= 0) members[idx] = member; else members.push(member);
  saveJSON(STORAGE_KEYS.orgMembers, members);
  return { ...member };
}

export async function adminDeleteOrgMember(id: string): Promise<void> {
  const members = getMembers().filter((m) => m.id !== id).map((m) => (m.parentId === id ? { ...m, parentId: null } : m));
  saveJSON(STORAGE_KEYS.orgMembers, members);
}

export async function adminGetOrgStats() {
  const members = getMembers();
  const units = getUnits();
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
