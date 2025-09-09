import { useEffect, useRef, useState } from 'react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  size: number;
  category: 'known' | 'novel' | 'processing';
  connections: string[];
}

export const DataVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          generateDataPoints();
        }
      },
      { threshold: 0.3 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const generateDataPoints = () => {
    const points: DataPoint[] = [];
    const categories: DataPoint['category'][] = ['known', 'novel', 'processing'];
    
    for (let i = 0; i < 30; i++) {
      const id = `point-${i}`;
      points.push({
        id,
        x: Math.random() * 800 + 50,
        y: Math.random() * 400 + 50,
        size: Math.random() * 8 + 4,
        category: categories[Math.floor(Math.random() * categories.length)],
        connections: [],
      });
    }

    // Create connections
    points.forEach((point, index) => {
      const connectionCount = Math.random() * 3;
      for (let i = 0; i < connectionCount; i++) {
        const targetIndex = Math.floor(Math.random() * points.length);
        if (targetIndex !== index) {
          point.connections.push(points[targetIndex].id);
        }
      }
    });

    setDataPoints(points);
  };

  const getCategoryColor = (category: DataPoint['category']) => {
    switch (category) {
      case 'known': return 'hsl(180, 75%, 45%)'; // Teal
      case 'novel': return 'hsl(195, 85%, 55%)'; // Blue
      case 'processing': return 'hsl(270, 65%, 60%)'; // Purple
    }
  };

  return (
    <div className="data-visualization w-full h-96 rounded-lg border border-border/20 overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 900 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {isVisible && dataPoints.map((point) =>
          point.connections.map((connectionId, index) => {
            const connectedPoint = dataPoints.find(p => p.id === connectionId);
            if (!connectedPoint) return null;

            return (
              <line
                key={`${point.id}-${connectionId}`}
                x1={point.x}
                y1={point.y}
                x2={connectedPoint.x}
                y2={connectedPoint.y}
                stroke="hsl(195, 85%, 55%)"
                strokeWidth="1"
                opacity="0.3"
                className="animate-pulse-bioluminescent"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            );
          })
        )}

        {/* Data points */}
        {isVisible && dataPoints.map((point, index) => (
          <g key={point.id}>
            {/* Outer glow */}
            <circle
              cx={point.x}
              cy={point.y}
              r={point.size + 4}
              fill={getCategoryColor(point.category)}
              opacity="0.3"
              filter="url(#glow)"
              className="animate-pulse-bioluminescent"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            />
            {/* Core point */}
            <circle
              cx={point.x}
              cy={point.y}
              r={point.size}
              fill={getCategoryColor(point.category)}
              className="animate-pulse-bioluminescent"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            />
            {/* Label for novel species */}
            {point.category === 'novel' && (
              <text
                x={point.x}
                y={point.y - point.size - 8}
                textAnchor="middle"
                className="fill-foreground text-xs font-inter"
                opacity="0.8"
              >
                Novel
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};