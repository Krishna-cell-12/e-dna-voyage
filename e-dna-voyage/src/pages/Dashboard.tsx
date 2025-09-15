import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AbyssBackground } from '@/components/AbyssBackground';
import GlobalMap from '@/components/GlobalMap';
import { 
  Globe, 
  Activity, 
  Brain,
  TrendingUp,
  MapPin,
  Filter
} from 'lucide-react';

interface BiodiversityData {
  location: string;
  latitude: number;
  longitude: number;
  depth: number;
  species: number;
  novelSpecies: number;
  confidence: number;
}

const Dashboard = () => {
  // Removed depth and timelapse controls
  const [selectedRegion, setSelectedRegion] = useState('');

  const biodiversityData: BiodiversityData[] = [
    {
      location: "Mariana Trench",
      latitude: 11.373,
      longitude: 142.591,
      depth: 10994,
      species: 147,
      novelSpecies: 23,
      confidence: 94.2
    },
    {
      location: "Puerto Rico Trench",
      latitude: 19.7,
      longitude: -65.5,
      depth: 8648,
      species: 89,
      novelSpecies: 15,
      confidence: 91.8
    },
    {
      location: "Japan Trench",
      latitude: 36.2,
      longitude: 142.9,
      depth: 9200,
      species: 112,
      novelSpecies: 19,
      confidence: 93.5
    }
  ];

  // Timelapse removed

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
  };

  const handleLocationClick = (data: any) => {
    console.log('Location clicked:', data);
  };

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold neon-text mb-6">
            Global Ocean Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Interactive 3D visualization of marine biodiversity across the world's deepest ocean trenches
          </p>
        </div>

        {/* Control Panel (simplified) */}
        <Card className="futuristic-card p-6 mb-8 border border-border/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neon-purple" />
                <span className="text-sm font-medium text-foreground">Region:</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-card border border-border/20 rounded px-3 py-1 text-sm text-foreground"
                >
                  <option value="">All Regions</option>
                  <option value="pacific">Pacific Ocean</option>
                  <option value="atlantic">Atlantic Ocean</option>
                  <option value="indian">Indian Ocean</option>
                  <option value="arctic">Arctic Ocean</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Global Map */}
          <div className="lg:col-span-2">
            <Card className="futuristic-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Global Ocean Map{selectedRegion ? ` - ${selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} Ocean` : ''}
              </h3>
              
              {/* Global Map */}
              <div className="aspect-[4/3] rounded-lg border border-border/20 relative overflow-hidden min-h-[500px]">
                <GlobalMap 
                  selectedRegion={selectedRegion}
                  onRegionSelect={handleRegionSelect}
                  onLocationClick={handleLocationClick}
                />
              </div>

              {/* Depth slider removed */}
            </Card>

            {/* Storytelling Mode */}
            <Card className="futuristic-card p-6 mt-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-purple" />
                AI Discovery Timeline
              </h3>
              <div className="space-y-4">
                {[
                  { year: "2024", discoveries: 847, region: "Pacific Trenches" },
                  { year: "2023", discoveries: 623, region: "Atlantic Abyssal Plains" },
                  { year: "2022", discoveries: 492, region: "Indian Ocean Ridges" }
                ].map((timeline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20">
                    <div>
                      <span className="font-medium text-neon-cyan">{timeline.year}</span>
                      <span className="text-sm text-muted-foreground ml-4">{timeline.region}</span>
                    </div>
                    <Badge className="bg-primary/20 text-primary">{timeline.discoveries} species</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Panels */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <Card className="futuristic-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-neural-pink" />
                Live Analytics
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">2,847</div>
                  <div className="text-sm text-muted-foreground">Active Samples</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-teal mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Novel Species Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-purple mb-1">94.7%</div>
                  <div className="text-sm text-muted-foreground">AI Confidence</div>
                </div>
              </div>
            </Card>

            {/* Location Data */}
            <Card className="futuristic-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-quantum-gold" />
                Research Stations
              </h3>
              <div className="space-y-3">
                {biodiversityData.map((data, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/20 hover:shadow-neon/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground text-sm">{data.location}</h4>
                      <Badge className="bg-bio-green/20 text-bio-green text-xs">{data.novelSpecies} new</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Depth: {data.depth.toLocaleString()}m</div>
                      <div>Species: {data.species}</div>
                      <div>Confidence: {data.confidence}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Neural Processing panel removed */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;