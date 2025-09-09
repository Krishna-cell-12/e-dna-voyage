import { useMemo } from 'react';

export type ZoneState = 'inactive' | 'searching' | 'comparing' | 'selecting' | 'merging' | 'complete';

interface ZoneGridProps {
  size?: number; // number of zones per side (default 8 => 64 zones)
  states: ZoneState[]; // length = size*size
  onZoneClick?: (index: number) => void;
}

const stateToClasses: Record<ZoneState, string> = {
  inactive: 'bg-muted/20 border-border/20',
  searching: 'bg-primary/30 border-primary/40 shadow-bioluminescent',
  comparing: 'bg-bioluminescent-teal/30 border-bioluminescent-teal/40 shadow-bioluminescent',
  selecting: 'bg-coral-glow/30 border-coral-glow/40 shadow-bioluminescent',
  merging: 'bg-bioluminescent-purple/30 border-bioluminescent-purple/40 shadow-bioluminescent',
  complete: 'bg-species-glow/30 border-species-glow/40 shadow-species',
};

export const ZoneGrid = ({ size = 8, states, onZoneClick }: ZoneGridProps) => {
  const cells = useMemo(() => Array.from({ length: size * size }, (_, i) => i), [size]);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {cells.map((index) => {
        const state: ZoneState = states[index] ?? 'inactive';
        return (
          <button
            key={index}
            className={`relative aspect-square rounded-md border transition-colors duration-200 ${stateToClasses[state]}`}
            onClick={() => onZoneClick?.(index)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs text-foreground/80">
              {index + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ZoneGrid;


