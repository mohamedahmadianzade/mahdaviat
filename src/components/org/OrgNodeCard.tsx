import { motion } from 'framer-motion';
import { Users, ChevronDown, ChevronLeft } from 'lucide-react';
import type { OrgTreeNode, ManagementLevel } from '../../types';
import { managementLevelLabels, managementLevelStyles } from '../../types';

interface OrgNodeCardProps {
  node: OrgTreeNode;
  expanded: boolean;
  onToggle: () => void;
  onClick: () => void;
  highlighted: boolean;
  dimmed: boolean;
}

const levelIcons: Record<ManagementLevel, string> = {
  executive: '★',
  deputy: '◆',
  department: '▣',
  unit: '◇',
  staff: '●',
};

export default function OrgNodeCard({ node, expanded, onToggle, onClick, highlighted, dimmed }: OrgNodeCardProps) {
  const childCount = node.children.length;

  return (
    <div className="org-card relative flex flex-col items-center">
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{
          opacity: dimmed ? 0.4 : 1,
          y: 0,
          scale: highlighted ? 1.03 : 1,
        }}
        whileHover={{ y: -5, scale: 1.03 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group relative w-[220px] cursor-pointer rounded-2xl border border-emerald/10 bg-white p-4 text-center shadow-soft transition-shadow hover:shadow-card-hover"
        onClick={onClick}
        style={highlighted ? { boxShadow: '0 0 0 3px rgba(201,162,39,0.5), 0 12px 40px -10px rgba(201,162,39,0.35)' } : undefined}
      >
        {/* Level badge */}
        <div className={`absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-sm ${managementLevelStyles[node.managementLevel]}`}>
          <span>{levelIcons[node.managementLevel]}</span>
          {managementLevelLabels[node.managementLevel]}
        </div>

        {/* Avatar */}
        <div className="relative mx-auto mb-3 mt-1 h-16 w-16 overflow-hidden rounded-full border-2 border-emerald/20 bg-emerald-soft shadow-soft">
          {node.image ? (
            <img src={node.image} alt={node.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-emerald">{node.name.charAt(0)}</div>
          )}
        </div>

        {/* Name + position */}
        <h3 className="line-clamp-1 font-display text-sm font-bold text-emerald-deep transition-colors group-hover:text-emerald">{node.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{node.position}</p>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-mutedLight">{node.department}</p>

        {/* Contact icons */}
        {(node.phone || node.email) && (
          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-mutedLight">
            {node.phone && <span className="inline-flex items-center gap-0.5">📞 {node.phone}</span>}
          </div>
        )}
      </motion.div>

      {/* Expand/collapse toggle */}
      {childCount > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald/20 bg-white px-3 py-1 text-[11px] font-medium text-emerald-deep shadow-soft transition-all hover:border-emerald hover:bg-emerald hover:text-white"
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3 rotate-90" />}
          <Users className="h-3 w-3" />
          <span>{childCount} زیرمجموعه</span>
        </button>
      )}
    </div>
  );
}
