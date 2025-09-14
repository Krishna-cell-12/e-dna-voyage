import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AbyssBackground } from '@/components/AbyssBackground';
import { DataVisualization } from '@/components/DataVisualization';
import SplineGlobe from '@/components/SplineGlobe';
import { 
  Globe, 
  Layers, 
  Activity, 
  Zap, 
  Brain,
  Microscope,
  TrendingUp,
  MapPin,
  Filter,
  PlayCircle,
  PauseCircle,
  RotateCcw
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
  const [selectedDepth, setSelectedDepth] = useState(2000);
  const [isTimelapseActive, setIsTimelapseActive] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

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

  const toggleTimelapse = () => {
    setIsTimelapseActive(!isTimelapseActive);
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

        {/* Control Panel */}
        <Card className="futuristic-card p-6 mb-8 border border-border/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-neon-teal" />
                <span className="text-sm font-medium text-foreground">Depth:</span>
                <select 
                  value={selectedDepth}
                  onChange={(e) => setSelectedDepth(Number(e.target.value))}
                  className="bg-card border border-border/20 rounded px-3 py-1 text-sm text-foreground"
                >
                  <option value={0}>Surface - 200m</option>
                  <option value={200}>200m - 1000m</option>
                  <option value={1000}>1000m - 4000m</option>
                  <option value={4000}>4000m - 6000m</option>
                  <option value={6000}>6000m+</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neon-purple" />
                <span className="text-sm font-medium text-foreground">Region:</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-card border border-border/20 rounded px-3 py-1 text-sm text-foreground"
                >
                  <option value="all">All Oceans</option>
                  <option value="pacific">Pacific</option>
                  <option value="atlantic">Atlantic</option>
                  <option value="indian">Indian</option>
                  <option value="arctic">Arctic</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleTimelapse}
                className={`${isTimelapseActive ? 'bg-neural-pink' : 'bg-primary'} hover:opacity-90 shadow-neon neural-pulse`}
              >
                {isTimelapseActive ? (
                  <>
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Time-lapse
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main 3D Globe */}
          <div className="lg:col-span-2">
            <Card className="futuristic-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Interactive Ocean Map
              </h3>
              
              {/* 3D Spline Globe */}
              <div className="aspect-[4/3] rounded-lg border border-border/20 relative overflow-hidden min-h-[500px]">
                <SplineGlobe className="w-full h-full" />
                
                {/* Floating Species Markers Overlay */}
                {biodiversityData.map((data, index) => (
                  <div
                    key={index}
                    className={`absolute w-4 h-4 rounded-full quantum-particle animate-quantum-drift shadow-neon z-10`}
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`,
                      animationDelay: `${index * 1.5}s`,
                      background: 'var(--gradient-neural)'
                    }}
                  />
                ))}
              </div>

              {/* Depth Slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Depth Range</span>
                  <span className="text-sm text-neon-cyan">{selectedDepth}m - {selectedDepth + 2000}m</span>
                </div>
                <Progress value={(selectedDepth / 11000) * 100} className="h-3" />
              </div>
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

            {/* AI Processing */}
            <Card className="futuristic-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-cyan" />
                Neural Processing
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">DNA Sequences</span>
                  <span className="text-sm font-medium text-neon-cyan">Processing...</span>
                </div>
                <Progress value={78} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Species Classification</span>
                  <span className="text-sm font-medium text-neon-teal">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Novel Detection</span>
                  <span className="text-sm font-medium text-neon-purple">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </Card>
          </div>
        </div>

        {/* Network Visualization */}
        <Card className="futuristic-card p-6 mt-8 border border-border/20">
          <h3 className="font-montserrat font-semibold mb-6 text-foreground flex items-center gap-2">
            <Microscope className="w-5 h-5 text-bio-green" />
            Species Interaction Network
          </h3>
          <DataVisualization />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;