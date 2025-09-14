import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RegionData {
  id: string;
  name: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  species: {
    name: string;
    count: number;
    color: string;
  }[];
}

interface GlobalMapProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
  onLocationClick: (data: any) => void;
}

const GlobalMap: React.FC<GlobalMapProps> = ({ selectedRegion, onRegionSelect, onLocationClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);

  const regions: RegionData[] = [
    {
      id: 'pacific',
      name: 'Pacific Ocean',
      center: [-150, 0],
      bounds: [[-180, -60], [-100, 60]],
      species: [
        { name: 'Tursiops truncatus', count: 245, color: '#3b82f6' },
        { name: 'Carcharodon carcharias', count: 189, color: '#10b981' },
        { name: 'Manta birostris', count: 156, color: '#8b5cf6' },
        { name: 'Chelonia mydas', count: 134, color: '#f59e0b' },
        { name: 'Megaptera novaeangliae', count: 98, color: '#ef4444' }
      ]
    },
    {
      id: 'atlantic',
      name: 'Atlantic Ocean',
      center: [-30, 20],
      bounds: [[-80, -60], [20, 60]],
      species: [
        { name: 'Orcinus orca', count: 178, color: '#3b82f6' },
        { name: 'Balaenoptera musculus', count: 145, color: '#10b981' },
        { name: 'Dermochelys coriacea', count: 123, color: '#8b5cf6' },
        { name: 'Zalophus californianus', count: 89, color: '#f59e0b' },
        { name: 'Phoca vitulina', count: 67, color: '#ef4444' }
      ]
    },
    {
      id: 'indian',
      name: 'Indian Ocean',
      center: [70, -20],
      bounds: [[20, -60], [120, 30]],
      species: [
        { name: 'Tursiops aduncus', count: 198, color: '#3b82f6' },
        { name: 'Rhincodon typus', count: 167, color: '#10b981' },
        { name: 'Eretmochelys imbricata', count: 145, color: '#8b5cf6' },
        { name: 'Sousa chinensis', count: 112, color: '#f59e0b' },
        { name: 'Tursiops truncatus', count: 89, color: '#ef4444' }
      ]
    },
    {
      id: 'arctic',
      name: 'Arctic Ocean',
      center: [0, 80],
      bounds: [[-180, 60], [180, 90]],
      species: [
        { name: 'Balaena mysticetus', count: 156, color: '#3b82f6' },
        { name: 'Delphinapterus leucas', count: 134, color: '#10b981' },
        { name: 'Monodon monoceros', count: 98, color: '#8b5cf6' },
        { name: 'Phoca hispida', count: 78, color: '#f59e0b' },
        { name: 'Ursus maritimus', count: 45, color: '#ef4444' }
      ]
    }
  ];

  const currentRegion = regions.find(r => r.id === selectedRegion) || regions[0];

  useEffect(() => {
    if (mapRef.current) {
      // Simple map visualization using CSS and positioning
      const mapElement = mapRef.current;
      mapElement.innerHTML = '';
      
      // Create world map background with continents
      const worldMap = document.createElement('div');
      worldMap.className = 'absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 rounded-lg';
      worldMap.style.backgroundImage = `
        radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 10% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
      `;
      mapElement.appendChild(worldMap);

      // Add continent outlines (simplified)
      const continents = [
        { name: 'North America', path: 'M 10,20 L 30,15 L 35,25 L 25,35 L 15,30 Z', color: 'rgba(34, 197, 94, 0.3)' },
        { name: 'South America', path: 'M 20,50 L 25,45 L 30,60 L 25,70 L 20,65 Z', color: 'rgba(34, 197, 94, 0.3)' },
        { name: 'Africa', path: 'M 45,35 L 50,30 L 55,50 L 50,65 L 45,60 Z', color: 'rgba(34, 197, 94, 0.3)' },
        { name: 'Europe', path: 'M 40,20 L 50,15 L 55,25 L 50,30 L 45,25 Z', color: 'rgba(34, 197, 94, 0.3)' },
        { name: 'Asia', path: 'M 60,15 L 85,10 L 90,25 L 85,40 L 70,35 L 65,25 Z', color: 'rgba(34, 197, 94, 0.3)' },
        { name: 'Australia', path: 'M 70,60 L 80,55 L 85,70 L 80,75 L 75,70 Z', color: 'rgba(34, 197, 94, 0.3)' }
      ];

      continents.forEach(continent => {
        const continentEl = document.createElement('div');
        continentEl.innerHTML = `
          <svg width="100%" height="100%" viewBox="0 0 100 100" style="position: absolute; top: 0; left: 0;">
            <path d="${continent.path}" fill="${continent.color}" stroke="rgba(34, 197, 94, 0.5)" stroke-width="0.5"/>
          </svg>
        `;
        mapElement.appendChild(continentEl);
      });

      // Add region highlights
      regions.forEach((region) => {
        const highlight = document.createElement('div');
        highlight.className = `absolute rounded-full transition-all duration-500 ${
          selectedRegion === region.id 
            ? 'bg-primary/30 shadow-bioluminescent border-2 border-primary' 
            : 'bg-transparent hover:bg-bioluminescent-teal/20'
        }`;
        
        // Position and size based on region bounds
        const x = ((region.center[0] + 180) / 360) * 100;
        const y = ((90 - region.center[1]) / 180) * 100;
        const width = Math.abs(region.bounds[1][0] - region.bounds[0][0]) / 360 * 100;
        const height = Math.abs(region.bounds[1][1] - region.bounds[0][1]) / 180 * 100;
        
        highlight.style.left = `${x - width/2}%`;
        highlight.style.top = `${y - height/2}%`;
        highlight.style.width = `${width}%`;
        highlight.style.height = `${height}%`;
        highlight.style.borderRadius = '50%';
        
        highlight.addEventListener('click', () => {
          onRegionSelect(region.id);
          setSelectedLocation(region);
          setShowSpeciesDialog(true);
        });
        
        mapElement.appendChild(highlight);
      });

      // Add region markers
      regions.forEach((region, index) => {
        const marker = document.createElement('div');
        marker.className = `absolute w-6 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
          selectedRegion === region.id 
            ? 'bg-primary shadow-bioluminescent scale-125 border-2 border-white' 
            : 'bg-bioluminescent-teal hover:scale-110 border border-white/50'
        }`;
        
        // Position markers based on region center
        const x = ((region.center[0] + 180) / 360) * 100;
        const y = ((90 - region.center[1]) / 180) * 100;
        
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        
        // Add marker number
        marker.innerHTML = `<span class="text-xs font-bold text-white">${index + 1}</span>`;
        
        marker.addEventListener('click', () => {
          onRegionSelect(region.id);
          setSelectedLocation(region);
          setShowSpeciesDialog(true);
        });
        
        mapElement.appendChild(marker);
      });

      // Add region labels
      regions.forEach((region) => {
        const label = document.createElement('div');
        label.className = `absolute text-sm text-white font-medium pointer-events-none transition-all duration-300 ${
          selectedRegion === region.id ? 'text-primary font-bold' : 'text-white/80'
        }`;
        label.textContent = region.name;
        
        const x = ((region.center[0] + 180) / 360) * 100;
        const y = ((90 - region.center[1]) / 180) * 100;
        
        label.style.left = `${x}%`;
        label.style.top = `${y + 4}%`;
        label.style.transform = 'translate(-50%, -50%)';
        label.style.textShadow = '0 0 10px rgba(0,0,0,0.8)';
        
        mapElement.appendChild(label);
      });

      // Add grid lines for better visualization
      const grid = document.createElement('div');
      grid.innerHTML = `
        <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0; opacity: 0.3;">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.3)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      `;
      mapElement.appendChild(grid);
    }
  }, [selectedRegion, onRegionSelect]);

  const chartData = selectedLocation?.species.map(species => ({
    name: species.name.split(' ')[0], // Use genus only for cleaner display
    count: species.count,
    fullName: species.name
  })) || [];

  return (
    <>
      <div 
        ref={mapRef} 
        className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
      />
      
      <Dialog open={showSpeciesDialog} onOpenChange={setShowSpeciesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat font-bold text-foreground">
              Species Distribution - {selectedLocation?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Line Chart */}
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Species Count Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                    formatter={(value: any, name: string, props: any) => [
                      value, 
                      `Count: ${props.payload.fullName}`
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Species List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Species Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLocation?.species.map((species, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-muted/10 border border-border/20 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{species.name}</h4>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: species.color }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Count: <span className="font-semibold text-primary">{species.count}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/5 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedLocation?.species.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Species</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bioluminescent-teal">
                  {selectedLocation?.species.reduce((sum, s) => sum + s.count, 0) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Count</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-glow">
                  {selectedLocation?.species.length ? 
                    Math.round(selectedLocation.species.reduce((sum, s) => sum + s.count, 0) / selectedLocation.species.length) : 0
                  }
                </div>
                <div className="text-sm text-muted-foreground">Avg per Species</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalMap;
