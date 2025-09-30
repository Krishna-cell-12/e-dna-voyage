import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AbyssBackground } from '@/components/AbyssBackground';
import { PhylogeneticTree, type TaxonNode } from '@/components/PhylogeneticTree';
import { ZoneGrid, ZoneState } from '@/components/ZoneGrid';
import { useAnalysis, type AnalysisResult } from '@/contexts/AnalysisContext';
import { 
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
import { useToast } from '@/components/ui/use-toast';

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
  const [zoneAggregationLevel, setZoneAggregationLevel] = useState<'phylum' | 'class'>('phylum');
  
  const { analysisResults, uploadedFiles } = useAnalysis();
  const { toast } = useToast();
  
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
      // Aggregate by selected taxonomic level rather than species
      const selectedIndex = zoneAggregationLevel === 'phylum' ? 22 : 33;
      setZoneStates((prev) => prev.map((_, i) => (i === selectedIndex ? 'selecting' : 'searching')));
      timers.push(window.setTimeout(() => mounted && setStep(3), 1800));
    }
    if (step === 3) {
      // Focus on the selected aggregated zone
      const selectedIndex = zoneAggregationLevel === 'phylum' ? 22 : 33;
      setZoneStates((prev) => prev.map((_, i) => (i === selectedIndex ? 'comparing' : 'inactive')));
      timers.push(window.setTimeout(() => mounted && setStep(4), 1800));
    }
    if (step === 4) {
      // Merging results
      const selectedIndex = zoneAggregationLevel === 'phylum' ? 22 : 33;
      setZoneStates((prev) => prev.map((_, i) => (i === selectedIndex ? 'merging' : 'inactive')));
      timers.push(window.setTimeout(() => mounted && setStep(5), 1600));
    }
    if (step === 5) {
      const selectedIndex = zoneAggregationLevel === 'phylum' ? 22 : 33;
      setZoneStates((prev) => prev.map((_, i) => (i === selectedIndex ? 'complete' : 'inactive')));
    }

    return () => {
      mounted = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [step, zoneAggregationLevel]);

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

  // Only show species derived from the user's selected file data
  const currentAnalysisFromContext = analysisResults.find(r => r.id === selectedResult);
  const novelSpeciesData = currentAnalysisFromContext
    ? [
        {
          name: currentAnalysisFromContext.species,
          confidence: currentAnalysisFromContext.confidence,
          sequences: Math.max(1, Math.round(currentAnalysisFromContext.totalSequences * 0.01)),
          classification: currentAnalysisFromContext.novelSpecies > 0 ? 'Potentially novel' : 'Known match',
          color: currentAnalysisFromContext.novelSpecies > 0 ? 'text-coral-glow' : 'text-bioluminescent-teal',
        },
      ]
    : [];

  const currentResult = allAnalysisResults.find(r => r.id === selectedResult) || allAnalysisResults[0];
  const formatPercent = (n: number, digits: number = 4) => {
    if (Number.isFinite(n)) return Number(n).toFixed(digits);
    return '0.0000';
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(currentResult, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentResult.sampleName || 'analysis'}-${currentResult.id}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Analysis JSON downloaded.' });
    } catch (e) {
      toast({ title: 'Export failed', description: 'Could not export analysis.', variant: 'destructive' as any });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/results?selected=${encodeURIComponent(currentResult.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'e-dna-voyage Result', text: currentResult.sampleName, url: shareUrl });
        toast({ title: 'Shared', description: 'Share sheet opened.' });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link copied', description: 'Share URL copied to clipboard.' });
    } catch (e) {
      toast({ title: 'Share failed', description: 'Could not share or copy link.', variant: 'destructive' as any });
    }
  };

  // Example tree. In a real pipeline this would be produced from the sample classification results
  const exampleTree: TaxonNode = {
    name: 'Life',
    rank: 'root',
    children: [
      {
        name: 'Animalia',
        rank: 'kingdom',
        children: [
          {
            name: 'Cnidaria',
            rank: 'phylum',
            children: [
              {
                name: 'Medusozoa',
                rank: 'class',
                children: [
                  {
                    name: 'Hydrozoa',
                    rank: 'order',
                    children: [
                      {
                        name: 'Aequorea',
                        rank: 'genus',
                        children: [
                          { name: 'Aequorea victoria', rank: 'species' }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const highlightedPath = ['Animalia', 'Cnidaria', 'Medusozoa', 'Hydrozoa', 'Aequorea', 'Aequorea victoria'];

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
                  <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10" onClick={handleShare}>
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
                    {formatPercent(currentResult.confidence)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>
            </Card>

            {/* Detailed Results Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-card/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="novel">Novel Species</TabsTrigger>
                <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* ZHNSW Algorithm Analysis */}
                <Card className="deep-card p-6 border border-border/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-semibold text-foreground">
                      ZHNSW Algorithm Analysis
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Aggregation</span>
                        <select
                          className="bg-card/50 border border-border/20 rounded px-2 py-1 text-foreground"
                          value={zoneAggregationLevel}
                          onChange={(e) => setZoneAggregationLevel(e.target.value as 'phylum' | 'class')}
                        >
                          <option value="phylum">Phylum</option>
                          
                        </select>
                      </div>
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
                  {novelSpeciesData.length > 0 ? (
                    <div className="space-y-4">
                      {novelSpeciesData.map((species, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/10 border border-border/20">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-medium ${species.color}`}>
                              {species.name}
                            </h4>
                            <Badge className="bg-species-glow/20 text-species-glow">
                              {formatPercent(species.confidence)}% confidence
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{species.sequences} sequences analyzed</span>
                            <span className="font-medium text-foreground">{species.classification}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No novel species identified for this sample.</div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="taxonomy" className="space-y-6">
                <Card className="deep-card p-6 border border-border/20">
                  <h3 className="font-montserrat font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-bioluminescent-purple" />
                    Taxonomic Classification
                  </h3>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Phylogenetic Tree Visualization — DNA match hone ke baad interactive tree dikhata hai. Example path: Jellyfish DNA → Cnidaria → Medusozoa → Aequorea victoria.
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="h-80">
                        <PhylogeneticTree root={exampleTree} highlightPath={highlightedPath} />
                      </div>
                      <div className="rounded-lg bg-muted/10 border border-border/20 p-4 text-sm text-muted-foreground">
                        <div className="font-montserrat font-semibold text-foreground mb-2">Highlighted Path</div>
                        <div className="flex flex-wrap items-center gap-2">
                          {highlightedPath.map((name, idx) => (
                            <>
                              <span key={name} className="px-2 py-1 rounded bg-primary/15 text-foreground border border-border/20">{name}</span>
                              {idx < highlightedPath.length - 1 && <span className="opacity-60">→</span>}
                            </>
                          ))}
                        </div>
                        <div className="mt-3 text-xs">
                          Path shows where your sample best fits in the tree based on sequence similarity.
                        </div>
                      </div>
                    </div>
                  </div>
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