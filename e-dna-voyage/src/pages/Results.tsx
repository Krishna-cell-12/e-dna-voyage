import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AbyssBackground } from '@/components/AbyssBackground';
import { DataVisualization } from '@/components/DataVisualization';
import { ZoneGrid, ZoneState } from '@/components/ZoneGrid';
import { useAnalysis, type AnalysisResult } from '@/contexts/AnalysisContext';
import { 
  BarChart3, 
  Dna, 
  Eye, 
  Download, 
  Share2, 
  MapPin, 
  Calendar,
  TrendingUp,
  Fish,
  Microscope,
  Star
} from 'lucide-react';

interface LegacyAnalysisResult {
  id: string;
  sampleName: string;
  date: string;
  location: string;
  totalSequences: number;
  knownSpecies: number;
  novelSpecies: number;
  confidence: number;
  status: 'completed' | 'processing' | 'failed';
}

const Results = () => {
  const [step, setStep] = useState<number>(2); // 1-5 like in the mock
  const [zoneStates, setZoneStates] = useState<ZoneState[]>(Array.from({ length: 64 }, () => 'inactive'));
  
  const { analysisResults, uploadedFiles } = useAnalysis();
  
  // Set default selected result to first uploaded analysis or first legacy result
  const [selectedResult, setSelectedResult] = useState<string>(() => {
    if (analysisResults.length > 0) {
      return analysisResults[0].id;
    }
    return 'sample-001';
  });

  // Simulate animated analysis across steps
  useEffect(() => {
    let mounted = true;
    const timers: number[] = [];

    // Reset
    setZoneStates(Array.from({ length: 64 }, () => 'inactive'));

    if (step === 2) {
      // Searching many zones
      const indices = [6, 11, 33];
      setZoneStates((prev) => prev.map((_, i) => (indices.includes(i) ? 'selecting' : 'searching')));
      timers.push(window.setTimeout(() => mounted && setStep(3), 1800));
    }
    if (step === 3) {
      // Focus on the 3 selected zones
      const indices = [6, 11, 33];
      setZoneStates((prev) => prev.map((_, i) => (indices.includes(i) ? 'comparing' : 'inactive')));
      timers.push(window.setTimeout(() => mounted && setStep(4), 1800));
    }
    if (step === 4) {
      // Merging results
      const indices = [6, 11, 33];
      setZoneStates((prev) => prev.map((_, i) => (indices.includes(i) ? 'merging' : 'inactive')));
      timers.push(window.setTimeout(() => mounted && setStep(5), 1600));
    }
    if (step === 5) {
      const indices = [6, 11, 33];
      setZoneStates((prev) => prev.map((_, i) => (indices.includes(i) ? 'complete' : 'inactive')));
    }

    return () => {
      mounted = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [step]);

  // Legacy analysis results for demo purposes
  const legacyAnalysisResults: LegacyAnalysisResult[] = [
    {
      id: 'sample-001',
      sampleName: 'Mariana Trench - Station Alpha',
      date: '2024-01-15',
      location: '11°22\'N 142°35\'E',
      totalSequences: 156789,
      knownSpecies: 87,
      novelSpecies: 23,
      confidence: 94.7,
      status: 'completed'
    },
    {
      id: 'sample-002',
      sampleName: 'Abyssal Plain - Deep Site B',
      date: '2024-01-12',
      location: '10°15\'N 140°22\'E',
      totalSequences: 203456,
      knownSpecies: 112,
      novelSpecies: 31,
      confidence: 91.2,
      status: 'completed'
    },
    {
      id: 'sample-003',
      sampleName: 'Hadal Zone - Challenger Deep',
      date: '2024-01-10',
      location: '11°19\'N 142°12\'E',
      totalSequences: 89234,
      knownSpecies: 45,
      novelSpecies: 18,
      confidence: 89.8,
      status: 'processing'
    }
  ];

  // Convert context analysis results to display format
  const convertedAnalysisResults = analysisResults.map(result => {
    // Extract coordinates from location string if it contains them
    let locationDisplay = result.location || 'Unknown Location';
    
    // If location contains coordinates format (e.g., "40.7128°N, 74.0060°E"), use it as is
    // If it contains an address, try to extract coordinates from the original file data
    if (result.location && !result.location.includes('°')) {
      // This is likely an address, try to find the original coordinates
      const originalFile = uploadedFiles.find(file => file.id === result.id.replace('result-', ''));
      if (originalFile?.location) {
        locationDisplay = `${originalFile.location.latitude.toFixed(4)}°N, ${originalFile.location.longitude.toFixed(4)}°E`;
      }
    }
    
    return {
      id: result.id,
      sampleName: result.fileName,
      date: result.date,
      location: locationDisplay,
      totalSequences: result.totalSequences,
      knownSpecies: result.knownSpecies,
      novelSpecies: result.novelSpecies,
      confidence: result.confidence,
      status: result.status === 'Complete' ? 'completed' : result.status === 'Processing' ? 'processing' : 'failed'
    };
  });

  // Combine legacy and new results
  const allAnalysisResults = [...convertedAnalysisResults, ...legacyAnalysisResults];

  const novelSpeciesData = [
    {
      name: 'Bathypelagic Cephalopod SP-001',
      confidence: 96.2,
      sequences: 1247,
      classification: 'Likely new species',
      color: 'text-primary'
    },
    {
      name: 'Hadal Xenophyophore SP-002',
      confidence: 94.8,
      sequences: 892,
      classification: 'Novel genus candidate',
      color: 'text-bioluminescent-teal'
    },
    {
      name: 'Abyssal Polychaete SP-003',
      confidence: 92.1,
      sequences: 654,
      classification: 'Unknown family',
      color: 'text-bioluminescent-purple'
    },
    {
      name: 'Deep Sea Copepod SP-004',
      confidence: 88.7,
      sequences: 423,
      classification: 'Potential new order',
      color: 'text-coral-glow'
    }
  ];

  const currentResult = allAnalysisResults.find(r => r.id === selectedResult) || allAnalysisResults[0];

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
            Analysis Results
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore your eDNA analysis results, discover novel species, and dive deep into marine biodiversity insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sample Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="deep-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                Recent Analyses
              </h3>
              <div className="space-y-3">
                {allAnalysisResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResult(result.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedResult === result.id
                        ? 'bg-primary/20 border-primary shadow-bioluminescent'
                        : 'bg-muted/10 border-border/20 hover:bg-primary/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {result.sampleName}
                      </h4>
                      <Badge 
                        variant={result.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {result.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {result.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/upload" className="block mt-6">
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  New Analysis
                </Button>
              </Link>
            </Card>
          </div>

          {/* Main Results Area */}
          <div className="lg:col-span-3">
            {/* Sample Overview */}
            <Card className="deep-card p-6 mb-6 border border-border/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-montserrat font-bold text-foreground">
                  {currentResult.sampleName}
                </h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {currentResult.totalSequences.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">DNA Sequences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bioluminescent-teal mb-1">
                    {currentResult.knownSpecies}
                  </div>
                  <div className="text-sm text-muted-foreground">Known Species</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coral-glow mb-1">
                    {currentResult.novelSpecies}
                  </div>
                  <div className="text-sm text-muted-foreground">Novel Species</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-species-glow mb-1">
                    {currentResult.confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>
            </Card>

            {/* Detailed Results Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="novel">Novel Species</TabsTrigger>
                <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* ZHNSW Algorithm Analysis */}
                <Card className="deep-card p-6 border border-border/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-semibold text-foreground">
                      ZHNSW Algorithm Analysis
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded-md border border-border/20 ${step >= 2 ? 'bg-primary/20 text-primary' : ''}`}>1</span>
                      <span className={`px-2 py-1 rounded-md border border-border/20 ${step >= 2 ? 'bg-primary/20 text-primary' : ''}`}>2</span>
                      <span className={`px-2 py-1 rounded-md border border-border/20 ${step >= 3 ? 'bg-primary/20 text-primary' : ''}`}>3</span>
                      <span className={`px-2 py-1 rounded-md border border-border/20 ${step >= 4 ? 'bg-primary/20 text-primary' : ''}`}>4</span>
                      <span className={`px-2 py-1 rounded-md border border-border/20 ${step >= 5 ? 'bg-species-glow/20 text-species-glow' : ''}`}>5</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-montserrat font-medium mb-3 text-foreground">Zone Grid (64 Zones)</h4>
                      <ZoneGrid size={8} states={zoneStates} />
                      <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded bg-muted/20">Inactive</span>
                        <span className="px-2 py-1 rounded bg-primary/30">Searching</span>
                        <span className="px-2 py-1 rounded bg-bioluminescent-teal/30">Comparing</span>
                        <span className="px-2 py-1 rounded bg-coral-glow/30">Selecting</span>
                        <span className="px-2 py-1 rounded bg-bioluminescent-purple/30">Merging</span>
                        <span className="px-2 py-1 rounded bg-species-glow/30">Complete</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium mb-3 text-foreground">Step Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Current Step</span><span className="font-medium text-primary">{step}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Strategy</span><span className="font-medium">Heuristic Based</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Zones Selected</span><span className="font-medium">3</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Zones Skipped</span><span className="font-medium">61</span></div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="deep-card p-6 border border-border/20">
                    <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Diversity Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Shannon Index</span>
                        <span className="font-medium text-primary">4.23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Simpson Index</span>
                        <span className="font-medium text-bioluminescent-teal">0.87</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Evenness</span>
                        <span className="font-medium text-coral-glow">0.92</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Richness</span>
                        <span className="font-medium text-species-glow">110</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="deep-card p-6 border border-border/20">
                    <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                      <Fish className="w-5 h-5 text-bioluminescent-teal" />
                      Taxonomic Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Arthropoda</span>
                        <Badge className="bg-primary/20 text-primary">42%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cnidaria</span>
                        <Badge className="bg-bioluminescent-teal/20 text-bioluminescent-teal">28%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mollusca</span>
                        <Badge className="bg-coral-glow/20 text-coral-glow">18%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Other</span>
                        <Badge className="bg-muted text-muted-foreground">12%</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="novel" className="space-y-6">
                <Card className="deep-card p-6 border border-border/20">
                  <h3 className="font-montserrat font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-coral-glow" />
                    Novel Species Discoveries
                  </h3>
                  <div className="space-y-4">
                    {novelSpeciesData.map((species, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/10 border border-border/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium ${species.color}`}>
                            {species.name}
                          </h4>
                          <Badge className="bg-species-glow/20 text-species-glow">
                            {species.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{species.sequences} sequences analyzed</span>
                          <span className="font-medium text-foreground">{species.classification}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="taxonomy" className="space-y-6">
                <Card className="deep-card p-6 border border-border/20">
                  <h3 className="font-montserrat font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-bioluminescent-purple" />
                    Taxonomic Classification
                  </h3>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      AI-powered classification results with phylogenetic analysis
                    </div>
                    {/* Placeholder for taxonomic tree visualization */}
                    <div className="h-64 rounded-lg bg-muted/10 border border-border/20 flex items-center justify-center">
                      <div className="text-center">
                        <Dna className="w-12 h-12 text-primary mx-auto mb-2 animate-glow" />
                        <p className="text-muted-foreground">Taxonomic tree visualization</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="network" className="space-y-6">
                <Card className="deep-card p-6 border border-border/20">
                  <h3 className="font-montserrat font-semibold mb-6 text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Species Interaction Network
                  </h3>
                  <DataVisualization />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;