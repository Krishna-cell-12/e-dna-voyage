import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface TaxonNode {
  name: string;
  rank: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'genus' | 'species' | 'root';
  children?: TaxonNode[];
}

interface PhylogeneticTreeProps {
  root: TaxonNode;
  highlightPath?: string[]; // ordered list of taxon names to highlight
}

export function PhylogeneticTree({ root, highlightPath = [] }: PhylogeneticTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [root.name]: true });

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const isHighlighted = (name: string) => highlightPath.includes(name);

  const renderNode = (node: TaxonNode, depth: number) => {
    const key = `${node.rank}:${node.name}`;
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded[key] ?? (depth <= 1); // open first two levels by default

    return (
      <div key={key} className="mb-1">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer border border-border/20 ${
            isHighlighted(node.name) ? 'bg-primary/15 text-foreground' : 'bg-muted/10 text-foreground'
          }`}
          onClick={() => hasChildren && toggle(key)}
        >
          {hasChildren && (
            <span className={`w-4 text-center ${isOpen ? 'rotate-90' : ''}`}>▶</span>
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="font-montserrat font-medium">
            {node.name}
          </span>
          <Badge className="ml-auto text-xs bg-card/60 border border-border/20 capitalize">
            {node.rank}
          </Badge>
        </div>
        {hasChildren && isOpen && (
          <div className="pl-4 border-l border-border/20 mt-1">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="deep-card p-4 border border-border/20 h-full overflow-auto">
      {renderNode(root, 0)}
    </Card>
  );
}


