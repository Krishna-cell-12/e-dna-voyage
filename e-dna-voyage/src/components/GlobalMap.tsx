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
  const mapInstanceRef = useRef<any>(null);
  const dataLayerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showSpeciesDialog, setShowSpeciesDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Google Maps loader
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAZ9wXQZneu30fokTiuF4faAbcX4Q4HCqs';
  const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }
      const existing = document.getElementById('google-maps-js');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-maps-js';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  };

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
    },
    {
      id: 'southern',
      name: 'Southern Ocean',
      center: [0, -65],
      bounds: [[-180, -90], [180, -45]],
      species: [
        { name: 'Pygoscelis antarcticus', count: 120, color: '#3b82f6' },
        { name: 'Aptenodytes forsteri', count: 88, color: '#10b981' }
      ]
    }
  ];

  const currentRegion = selectedRegion ? regions.find(r => r.id === selectedRegion) : null;

  const OCEANS_GEOJSON: any = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: { id: 'pacific', name: 'Pacific Ocean' }, geometry: { type: 'Polygon', coordinates: [[[-180, -60], [-180, 60], [-100, 60], [-100, -60], [-180, -60]]] } },
      { type: 'Feature', properties: { id: 'atlantic', name: 'Atlantic Ocean' }, geometry: { type: 'Polygon', coordinates: [[[-80, -60], [-80, 60], [20, 60], [20, -60], [-80, -60]]] } },
      { type: 'Feature', properties: { id: 'indian', name: 'Indian Ocean' }, geometry: { type: 'Polygon', coordinates: [[[20, -60], [20, 30], [120, 30], [120, -60], [20, -60]]] } },
      { type: 'Feature', properties: { id: 'arctic', name: 'Arctic Ocean' }, geometry: { type: 'Polygon', coordinates: [[[-180, 60], [-180, 90], [180, 90], [180, 60], [-180, 60]]] } },
      { type: 'Feature', properties: { id: 'southern', name: 'Southern Ocean' }, geometry: { type: 'Polygon', coordinates: [[[-180, -90], [-180, -45], [180, -45], [180, -90], [-180, -90]]] } }
    ]
  };

  const DARK_OCEAN_STYLE: any[] = [
    { elementType: 'geometry', stylers: [{ color: '#08111c' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#08111c' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9db7c9' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06121b' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0c1824' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', stylers: [{ visibility: 'off' }] }
  ];

  useEffect(() => {
    let cleaned = false;
    loadGoogleMaps().then(() => {
      if (!mapRef.current || cleaned) return;
      const google = (window as any).google;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          minZoom: 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });
      }

      const map = mapInstanceRef.current;

      if (!dataLayerRef.current) {
        dataLayerRef.current = new google.maps.Data({ map });
        dataLayerRef.current.addGeoJson(OCEANS_GEOJSON);
      }

      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow({ disableAutoPan: true, pixelOffset: new google.maps.Size(0, -10) });
      }

      const dataLayer = dataLayerRef.current;
      const baseFill = '#0ea5a4';
      const baseStroke = '#22d3ee';
      const hoverStroke = '#a78bfa';
      const selectedFill = '#22d3ee';

      dataLayer.setStyle((feature: any) => {
        const isSelected = selectedId && feature.getProperty('id') === selectedId;
        return {
          fillColor: isSelected ? selectedFill : baseFill,
          fillOpacity: isSelected ? 0.25 : 0.12,
          strokeColor: isSelected ? hoverStroke : baseStroke,
          strokeOpacity: 0.7,
          strokeWeight: isSelected ? 2 : 1
        };
      });

      dataLayer.addListener('mouseover', (e: any) => {
        const name = e.feature.getProperty('name');
        if (name) {
          infoWindowRef.current.setContent(`<div style=\"padding:6px 10px;font-weight:600;color:#eaf9ff\">${name}</div>`);
          infoWindowRef.current.setPosition(e.latLng);
          infoWindowRef.current.open(map);
        }
        dataLayer.overrideStyle(e.feature, { strokeColor: hoverStroke, strokeWeight: 2, fillOpacity: 0.18 });
      });
      dataLayer.addListener('mouseout', (e: any) => {
        infoWindowRef.current.close();
        dataLayer.revertStyle(e.feature);
      });

      dataLayer.addListener('click', (e: any) => {
        const id = e.feature.getProperty('id');
        const name = e.feature.getProperty('name');
        setSelectedId(id);
        const region = regions.find(r => r.id === id);
        if (region) {
          onRegionSelect(region.id);
          setSelectedLocation(region);
          setShowSpeciesDialog(true);
        }
        // eslint-disable-next-line no-console
        console.log('Ocean clicked:', name);
        dataLayer.setStyle(dataLayer.getStyle());
      });

      const fitTo = () => {
        let bounds;
        if (selectedRegion) {
          switch (selectedRegion) {
            case 'pacific':
              bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60, -180), new google.maps.LatLng(60, -100));
              break;
            case 'atlantic':
              bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60, -80), new google.maps.LatLng(60, 20));
              break;
            case 'indian':
              bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60, 20), new google.maps.LatLng(30, 120));
              break;
            case 'arctic':
              bounds = new google.maps.LatLngBounds(new google.maps.LatLng(60, -180), new google.maps.LatLng(90, 180));
              break;
            case 'southern':
              bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-90, -180), new google.maps.LatLng(-45, 180));
              break;
            default:
              bounds = null;
          }
        }
        if (!bounds) bounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60, -180), new google.maps.LatLng(60, 180));
        map.fitBounds(bounds);
      };
      fitTo();

      // Optional: WebGL overlay skeleton
      if (google.maps.WebGLOverlayView) {
        const overlay = new google.maps.WebGLOverlayView();
        overlay.onContextRestored = ({ gl }: any) => {
          gl.clearColor(0.0, 0.0, 0.0, 0.0);
        };
        overlay.onDraw = ({ gl }: any) => {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };
        overlay.setMap(map);
      }
    });

    return () => {
      cleaned = true;
    };
  }, [selectedRegion, onRegionSelect, selectedId]);

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
