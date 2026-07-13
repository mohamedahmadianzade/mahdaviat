import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { OrgTreeNode } from '../../types';
import OrgNodeCard from './OrgNodeCard';

interface OrgTreeProps {
  nodes: OrgTreeNode[];
  highlightedIds: Set<string>;
  onPersonClick: (id: string) => void;
}

interface OrgTreeItemProps {
  node: OrgTreeNode;
  highlightedIds: Set<string>;
  onPersonClick: (id: string) => void;
  defaultExpanded: boolean;
  forceExpand: boolean;
}

function OrgTreeItem({ node, highlightedIds, onPersonClick, defaultExpanded, forceExpand }: OrgTreeItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isOpen = forceExpand || expanded;
  const hasChildren = node.children.length > 0;
  const highlighted = highlightedIds.has(node.id);
  const dimmed = highlightedIds.size > 0 && !highlighted && !forceExpand;

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  return (
    <div className="org-node" data-has-parent={node.parentId ? 'true' : 'false'} data-highlight={highlighted ? 'true' : 'false'}>
      <OrgNodeCard
        node={node}
        expanded={isOpen}
        onToggle={toggle}
        onClick={() => onPersonClick(node.id)}
        highlighted={highlighted}
        dimmed={dimmed}
      />
      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="org-children overflow-hidden"
            data-count={node.children.length}
            style={{ ['--child-w' as string]: '220px' }}
          >
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-0 pt-8">
              {node.children.map((child) => (
                <OrgTreeItem
                  key={child.id}
                  node={child}
                  highlightedIds={highlightedIds}
                  onPersonClick={onPersonClick}
                  defaultExpanded={false}
                  forceExpand={forceExpand}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrgTree({ nodes, highlightedIds, onPersonClick }: OrgTreeProps) {
  const forceExpand = highlightedIds.size > 0;

  return (
    <div className="flex flex-col items-center gap-0">
      {nodes.map((node, i) => (
        <OrgTreeItem
          key={node.id}
          node={node}
          highlightedIds={highlightedIds}
          onPersonClick={onPersonClick}
          defaultExpanded={i === 0 && !forceExpand}
          forceExpand={forceExpand}
        />
      ))}
    </div>
  );
}
