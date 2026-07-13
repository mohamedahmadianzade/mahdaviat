import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Search, X, Filter, Layers, Building2, Users } from 'lucide-react';
import type { OrgTreeNode, OrgSearchFilters, OrgUnit } from '../types';
import { emptyOrgFilters, managementLevelLabels } from '../types';
import { getOrgTree, getOrgMembers, getActiveOrgUnits, searchOrgMembers, getOrgFilterOptions } from '../lib/orgApi';
import OrgTree from './org/OrgTree';

interface OrgSectionProps {
  onPersonClick: (id: string) => void;
}

export default function OrgSection({ onPersonClick }: OrgSectionProps) {
  const [tree, setTree] = useState<OrgTreeNode[]>([]);
  const [filters, setFilters] = useState<OrgSearchFilters>(emptyOrgFilters);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [managementLevels, setManagementLevels] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getOrgTree(), getOrgMembers(), getActiveOrgUnits()]).then(([t, members, u]) => {
      setTree(t);
      setUnits(u);
      const opts = getOrgFilterOptions(members);
      setDepartments(opts.departments);
      setManagementLevels(opts.managementLevels);
      setLoading(false);
    });
  }, []);

  const highlightedIds = useMemo(() => {
    if (!filters.query && !filters.department && !filters.managementLevel && !filters.unitId) return new Set<string>();
    // We need members to search, but tree already has them. Flatten tree.
    const allMembers: OrgTreeNode[] = [];
    const walk = (nodes: OrgTreeNode[]) => {
      for (const n of nodes) {
        allMembers.push(n);
        if (n.children.length) walk(n.children);
      }
    };
    walk(tree);
    return searchOrgMembers(allMembers, filters);
  }, [filters, tree]);

  const update = useCallback(<K extends keyof OrgSearchFilters>(key: K, value: OrgSearchFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(emptyOrgFilters), []);
  const hasActiveFilters = filters.query || filters.department || filters.managementLevel || filters.unitId;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="org-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald text-white shadow-card"><Network className="h-6 w-6" /></div>
          <h1 className="font-display text-2xl font-bold text-emerald-deep sm:text-3xl">ساختار سازمانی</h1>
          <p className="mt-2 text-sm text-muted">نمودار درختی اعضای بنیاد مهدویت خراسان رضوی</p>
        </div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="mx-auto max-w-2xl">
          <div className="glass flex items-center gap-3 rounded-3xl px-5 py-3.5 shadow-card transition-all focus-within:shadow-card-hover focus-within:border-emerald/40">
            <Search className="h-5 w-5 shrink-0 text-emerald" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => update('query', e.target.value)}
              placeholder="جستجو بر اساس نام، سمت یا بخش..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mutedLight"
            />
            {filters.query && <button onClick={() => update('query', '')} className="rounded-full p-1 text-mutedLight hover:text-emerald transition-colors"><X className="h-4 w-4" /></button>}
            <button onClick={() => setShowFilters((v) => !v)} className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-medium transition-all ${showFilters ? 'border-emerald bg-emerald text-white' : 'border-emerald/20 text-emerald-deep hover:bg-emerald-soft'}`}>
              <Filter className="h-3.5 w-3.5" /><span className="hidden sm:inline">فیلتر</span>
            </button>
          </div>
        </motion.div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 20 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
              <div className="glass mx-auto max-w-4xl rounded-3xl p-6 shadow-card">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-semibold text-emerald-deep">فیلترهای پیشرفته</h3>
                  {hasActiveFilters && <button onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-emerald transition-colors"><X className="h-3.5 w-3.5" />پاک کردن</button>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><Building2 className="h-3.5 w-3.5" />بخش</label>
                    <select value={filters.department} onChange={(e) => update('department', e.target.value)} className="input-field cursor-pointer">
                      <option value="">همه</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><Layers className="h-3.5 w-3.5" />سطح مدیریت</label>
                    <select value={filters.managementLevel} onChange={(e) => update('managementLevel', e.target.value)} className="input-field cursor-pointer">
                      <option value="">همه</option>
                      {managementLevels.map((l) => <option key={l} value={l}>{managementLevelLabels[l as keyof typeof managementLevelLabels]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"><Users className="h-3.5 w-3.5" />واحد سازمانی</label>
                    <select value={filters.unitId} onChange={(e) => update('unitId', e.target.value)} className="input-field cursor-pointer">
                      <option value="">همه</option>
                      {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {filters.department && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-3 py-1 text-xs text-emerald-deep">{filters.department}<button onClick={() => update('department', '')}><X className="h-3 w-3" /></button></span>}
            {filters.managementLevel && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-3 py-1 text-xs text-emerald-deep">{managementLevelLabels[filters.managementLevel as keyof typeof managementLevelLabels]}<button onClick={() => update('managementLevel', '')}><X className="h-3 w-3" /></button></span>}
            {filters.unitId && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-3 py-1 text-xs text-emerald-deep">{units.find((u) => u.id === filters.unitId)?.name}<button onClick={() => update('unitId', '')}><X className="h-3 w-3" /></button></span>}
          </div>
        )}

        {/* Tree */}
        <div className="mt-16">
          {loading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="skeleton h-32 w-56 rounded-2xl" />
              <div className="flex gap-6">
                <div className="skeleton h-32 w-56 rounded-2xl" />
                <div className="skeleton h-32 w-56 rounded-2xl" />
                <div className="skeleton h-32 w-56 rounded-2xl" />
              </div>
            </div>
          ) : tree.length > 0 ? (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-fit">
                <OrgTree nodes={tree} highlightedIds={highlightedIds} onPersonClick={onPersonClick} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald/10 bg-white/60 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-soft text-emerald"><Network className="h-7 w-7" /></div>
              <h3 className="font-display text-lg font-semibold text-emerald-deep">موردی یافت نشد</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">هیچ عضوی برای نمایش وجود ندارد</p>
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
