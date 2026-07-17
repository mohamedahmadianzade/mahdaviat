import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Search,
  Users,
  Building2,
  Filter,
  X,
  Network,
} from 'lucide-react';
import {
  getOrgTree,
  getOrgMembers,
  getOrgFilterOptions,
  searchOrgMembers,
  buildOrgTree,
  flattenTree,
  findInTree,
  getAncestorIds,
  countDescendants,
} from '../lib/orgApi';
import type {
  OrgMember,
  OrgTreeNode,
  OrgSearchFilters,
} from '../types';
import { emptyOrgFilters, managementLevelLabels, managementLevelStyles } from '../types';

interface OrgSectionProps {
  onPersonClick: (id: string) => void;
}

export default function OrgSection({ onPersonClick }: OrgSectionProps) {
  const [tree, setTree] = useState<OrgTreeNode[]>([]);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [filters, setFilters] = useState<OrgSearchFilters>(emptyOrgFilters);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    managementLevels: string[];
    units: { id: string; name: string }[];
  }>({ departments: [], managementLevels: [], units: [] });

  // Load data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [treeData, membersData] = await Promise.all([getOrgTree(), getOrgMembers()]);
        setTree(treeData);
        setMembers(membersData);
        setFilterOptions(await getOrgFilterOptions(membersData));
        // Expand top-level nodes by default
        setExpandedIds(new Set(treeData.map((n) => n.id)));
      } catch {
        setTree([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search matches
  const matchedIds = useMemo(() => {
    if (!filters.query && !filters.department && !filters.managementLevel && !filters.unitId) {
      return null;
    }
    return searchOrgMembers(members, filters);
  }, [filters, members]);

  // Auto-expand ancestors of matched nodes
  useEffect(() => {
    if (!matchedIds || matchedIds.size === 0) return;
    const newExpanded = new Set(expandedIds);
    for (const id of matchedIds) {
      const ancestors = getAncestorIds(members, id);
      ancestors.forEach((a) => newExpanded.add(a));
    }
    setExpandedIds(newExpanded);
  }, [matchedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => {
    const all = new Set<string>();
    flattenTree(tree).forEach((n) => all.add(n.id));
    setExpandedIds(all);
  };

  const collapseAll = () => setExpandedIds(new Set());

  const resetFilters = () => setFilters(emptyOrgFilters);

  const hasFilters = Boolean(
    filters.query || filters.department || filters.managementLevel || filters.unitId,
  );

  // Recursive tree node renderer
  const renderNode = (node: OrgTreeNode, level: number): React.ReactNode => {
    const isExpanded = expandedIds.has(node.id);
    const isMatched = matchedIds?.has(node.id) ?? false;
    const childCount = countDescendants(node);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="relative">
        {/* Node card */}
        <motion.div
          layout
          className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
            isMatched
              ? 'border-gold bg-gold-soft/40 shadow-gold'
              : 'border-emerald/10 bg-white shadow-soft'
          }`}
          style={{ marginInlineStart: `${level * 24}px` }}
        >
          {/* Expand/collapse button */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-soft text-emerald transition-colors hover:bg-emerald hover:text-white"
            >
              <motion.span animate={{ rotate: isExpanded ? -90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronLeft className="h-4 w-4" />
              </motion.span>
            </button>
          )}
          {!hasChildren && <div className="w-8 shrink-0" />}

          {/* Member image */}
          <button
            onClick={() => onPersonClick(node.id)}
            className="group flex flex-1 items-center gap-3 text-right"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-emerald-soft">
              {node.image ? (
                <img src={node.image} alt={node.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald">
                  <Users className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-sm font-bold text-emerald-deep group-hover:text-emerald">
                  {node.name}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    managementLevelStyles[node.managementLevel] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {managementLevelLabels[node.managementLevel] ?? node.managementLevel}
                </span>
              </div>
              <p className="truncate text-xs text-muted">{node.position}</p>
              <p className="truncate text-[11px] text-mutedLight">{node.department}</p>
            </div>
          </button>

          {/* Child count badge */}
          {childCount > 0 && (
            <span className="shrink-0 rounded-full bg-emerald-soft px-2.5 py-1 text-[10px] font-medium text-emerald-deep">
              {childCount} زیرمجموعه
            </span>
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence initial={false}>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {node.children.map((child) => renderNode(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-emerald-deep">ساختار سازمانی</h2>
          <p className="text-xs text-muted">چارت و اعضای بنیاد مهدویت خراسان رضوی</p>
        </div>
      </div>

      {/* Search & filters */}
      <div className="mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            placeholder="جستجوی نام، سمت یا بخش..."
            className="input-field pr-12"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Filter className="h-3.5 w-3.5" />
            فیلتر:
          </div>

          {/* Department */}
          <select
            value={filters.department}
            onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            className="rounded-lg border border-emerald/15 bg-white px-3 py-2 text-xs text-ink outline-none focus:border-emerald"
          >
            <option value="">همه بخش‌ها</option>
            {filterOptions.departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Management level */}
          <select
            value={filters.managementLevel}
            onChange={(e) => setFilters((prev) => ({ ...prev, managementLevel: e.target.value }))}
            className="rounded-lg border border-emerald/15 bg-white px-3 py-2 text-xs text-ink outline-none focus:border-emerald"
          >
            <option value="">همه سطوح</option>
            {filterOptions.managementLevels.map((ml) => (
              <option key={ml} value={ml}>
                {managementLevelLabels[ml as keyof typeof managementLevelLabels] ?? ml}
              </option>
            ))}
          </select>

          {/* Unit */}
          <select
            value={filters.unitId}
            onChange={(e) => setFilters((prev) => ({ ...prev, unitId: e.target.value }))}
            className="rounded-lg border border-emerald/15 bg-white px-3 py-2 text-xs text-ink outline-none focus:border-emerald"
          >
            <option value="">همه واحدها</option>
            {filterOptions.units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-100"
            >
              <X className="h-3.5 w-3.5" />
              پاک کردن
            </button>
          )}

          {/* Expand/collapse all */}
          <div className="ms-auto flex gap-2">
            <button
              onClick={expandAll}
              className="rounded-lg border border-emerald/15 bg-white px-3 py-2 text-xs text-emerald-deep transition-colors hover:bg-emerald-soft"
            >
              باز کردن همه
            </button>
            <button
              onClick={collapseAll}
              className="rounded-lg border border-emerald/15 bg-white px-3 py-2 text-xs text-emerald-deep transition-colors hover:bg-emerald-soft"
            >
              بستن همه
            </button>
          </div>
        </div>

        {/* Match count */}
        {matchedIds && (
          <p className="text-xs text-muted">
            {matchedIds.size} نفر یافت شد
          </p>
        )}
      </div>

      {/* Tree */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-emerald/10 bg-white p-3">
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : tree.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald">
            <Building2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted">موردی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tree.map((node) => renderNode(node, 0))}
        </div>
      )}
    </div>
  );
}
