import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Dna, 
  Fish, 
  BarChart3, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Download,
  Share2,
  Microscope,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'draft';
    collaborators: number;
    samples: number;
    novelSpecies: number;
    tags: string[];
    relatedFiles: string[];
  };
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, project }) => {
  // Mock detailed analysis data
  const analysisData = {
    overview: {
      totalSequences: 156789,
      knownSpecies: 87,
      novelSpecies: 23,
      confidence: 94.7,
      completionRate: 78
    },
    species: [
      { name: 'Bathypelagic Cephalopod SP-001', confidence: 96.2, sequences: 1247, classification: 'Likely new species', color: 'text-primary' },
      { name: 'Hadal Xenophyophore SP-002', confidence: 94.8, sequences: 892, classification: 'Novel genus candidate', color: 'text-bioluminescent-teal' },
      { name: 'Abyssal Polychaete SP-003', confidence: 92.1, sequences: 654, classification: 'Unknown family', color: 'text-bioluminescent-purple' },
      { name: 'Deep Sea Copepod SP-004', confidence: 88.7, sequences: 423, classification: 'Potential new order', color: 'text-coral-glow' }
    ],
    metrics: {
      shannonIndex: 4.23,
      simpsonIndex: 0.87,
      evenness: 0.92,
      richness: 110
    },
    taxonomicBreakdown: [
      { phylum: 'Arthropoda', percentage: 42, color: 'bg-primary/20 text-primary' },
      { phylum: 'Cnidaria', percentage: 28, color: 'bg-bioluminescent-teal/20 text-bioluminescent-teal' },
      { phylum: 'Mollusca', percentage: 18, color: 'bg-coral-glow/20 text-coral-glow' },
      { phylum: 'Other', percentage: 12, color: 'bg-muted/20 text-muted-foreground' }
    ],
    timeline: [
      { date: '2024-01-15', event: 'Project initiated', status: 'completed' },
      { date: '2024-01-20', event: 'First samples collected', status: 'completed' },
      { date: '2024-02-01', event: 'DNA extraction completed', status: 'completed' },
      { date: '2024-02-15', event: 'Sequencing in progress', status: 'active' },
      { date: '2024-03-01', event: 'Analysis phase', status: 'pending' },
      { date: '2024-03-15', event: 'Report generation', status: 'pending' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/20 text-primary';
      case 'active': return 'bg-species-glow/20 text-species-glow';
      case 'pending': return 'bg-muted/20 text-muted-foreground';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const handleExport = async () => {
    try {
      const ensureJsPdf = () => new Promise<void>((resolve, reject) => {
        if ((window as any).jspdf?.jsPDF) return resolve();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.body.appendChild(s);
      });
      await ensureJsPdf();
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const marginX = 40;
      let y = 48;
      const addLine = (text: string, size = 12) => { doc.setFontSize(size); doc.text(text, marginX, y); y += size + 8; };
      const addSection = (title: string) => { y += 6; doc.setFontSize(14); doc.text(title, marginX, y); y += 16; };

      doc.setFontSize(18); doc.text(`${project.name} – Detailed Analysis`, marginX, y); y += 24;
      doc.setFontSize(11); doc.text(project.description || '', marginX, y); y += 18;
      [
        `Location: ${project.location}`,
        `Dates: ${project.startDate} – ${project.endDate}`,
        `Status: ${project.status}`,
        `Collaborators: ${project.collaborators}`,
        `Samples: ${project.samples}`,
      ].forEach((t) => { doc.setFontSize(11); doc.text(t, marginX, y); y += 16; });

      addSection('Overview');
      [
        `DNA Sequences: ${analysisData.overview.totalSequences.toLocaleString()}`,
        `Known Species: ${analysisData.overview.knownSpecies}`,
        `Novel Species: ${analysisData.overview.novelSpecies}`,
        `Confidence: ${analysisData.overview.confidence}%`,
      ].forEach((t) => addLine(t));

      addSection('Top Species');
      analysisData.species.forEach((s: any) => addLine(`${s.name} — ${s.sequences} sequences • ${s.confidence}% • ${s.classification}`));

      addSection('Diversity Metrics');
      const m = analysisData.metrics;
      [
        `Shannon Index: ${m.shannonIndex}`,
        `Simpson Index: ${m.simpsonIndex}`,
        `Evenness: ${m.evenness}`,
        `Richness: ${m.richness}`,
      ].forEach((t) => addLine(t));

      addSection('Taxonomic Breakdown');
      analysisData.taxonomicBreakdown.forEach((t: any) => addLine(`${t.phylum}: ${t.percentage}%`));

      addSection('Timeline');
      analysisData.timeline.forEach((t: any) => addLine(`${t.date}: ${t.event} (${t.status})`));

      doc.setFontSize(10);
      doc.text(`Exported ${new Date().toLocaleString()}`, marginX, doc.internal.pageSize.getHeight() - 24);

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '')}_analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'PDF downloaded with project details.' });
    } catch (err) {
      toast({ title: 'Export failed', description: 'Could not generate the project PDF.' });
    }
  };

  const handleShare = async () => {
    try {
      const ensureJsPdf = () => new Promise<void>((resolve, reject) => {
        if ((window as any).jspdf?.jsPDF) return resolve();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.body.appendChild(s);
      });
      await ensureJsPdf();
      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let y = 48;
      doc.setFontSize(18); doc.text(`${project.name} – Detailed Analysis`, 40, y); y += 24;
      doc.setFontSize(11); doc.text(`${project.description || ''}`, 40, y); y += 18;
      [
        `Location: ${project.location}`,
        `Dates: ${project.startDate} – ${project.endDate}`,
        `Status: ${project.status}`,
      ].forEach((t) => { doc.setFontSize(11); doc.text(t, 40, y); y += 16; });
      y += 6;
      doc.setFontSize(12); [
        `DNA Sequences: ${analysisData.overview.totalSequences.toLocaleString()}`,
        `Known Species: ${analysisData.overview.knownSpecies}`,
        `Novel Species: ${analysisData.overview.novelSpecies}`,
        `Confidence: ${analysisData.overview.confidence}%`,
      ].forEach((t) => { doc.text(t, 40, y); y += 16; });
      const blob = doc.output('blob');
      const file = new File([blob], `${project.name.replace(/\s+/g, '_')}_analysis.pdf`, { type: 'application/pdf' });
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ title: `${project.name} – Analysis`, text: 'eDNA project summary PDF', files: [file] });
        return;
      }
      const url = `${window.location.origin}/projects?projectId=${encodeURIComponent(project.id)}`;
      if (navigator.share) {
        await navigator.share({ title: `${project.name} – Analysis`, text: 'eDNA project summary', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Project link copied to clipboard.' });
      }
    } catch (err) {
      // ignore cancel
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat font-bold text-foreground">
              {project.name} - Detailed Analysis
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Overview */}
          <Card className="p-6 border border-border/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Project Overview</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{analysisData.overview.totalSequences.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">DNA Sequences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bioluminescent-teal mb-1">{analysisData.overview.knownSpecies}</div>
                <div className="text-sm text-muted-foreground">Known Species</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-glow mb-1">{analysisData.overview.novelSpecies}</div>
                <div className="text-sm text-muted-foreground">Novel Species</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-species-glow mb-1">{analysisData.overview.confidence}%</div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {project.startDate} - {project.endDate}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.collaborators} collaborators
              </div>
            </div>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="species" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-card/50">
              <TabsTrigger value="species">Species</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* Species Analysis */}
            <TabsContent value="species" className="space-y-4">
              <Card className="p-6 border border-border/20">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-coral-glow" />
                  Novel Species Discoveries
                </h3>
                <div className="space-y-4">
                  {analysisData.species.map((species, index) => (
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

            {/* Diversity Metrics */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Diversity Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shannon Index</span>
                      <span className="font-medium text-primary">{analysisData.metrics.shannonIndex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Simpson Index</span>
                      <span className="font-medium text-bioluminescent-teal">{analysisData.metrics.simpsonIndex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Evenness</span>
                      <span className="font-medium text-coral-glow">{analysisData.metrics.evenness}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Richness</span>
                      <span className="font-medium text-species-glow">{analysisData.metrics.richness}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Fish className="w-5 h-5 text-bioluminescent-teal" />
                    Taxonomic Breakdown
                  </h3>
                  <div className="space-y-3">
                    {analysisData.taxonomicBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{item.phylum}</span>
                        <Badge className={item.color}>{item.percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Taxonomy Analysis */}
            <TabsContent value="taxonomy" className="space-y-4">
              <Card className="p-6 border border-border/20">
                <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-bioluminescent-purple" />
                  Taxonomic Classification
                </h3>
                <div className="text-sm text-muted-foreground mb-4">
                  AI-powered classification results with phylogenetic analysis
                </div>
                <div className="h-64 rounded-lg bg-muted/10 border border-border/20 flex items-center justify-center">
                  <div className="text-center">
                    <Dna className="w-12 h-12 text-primary mx-auto mb-2 animate-glow" />
                    <p className="text-muted-foreground">Taxonomic tree visualization</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Project Timeline */}
            <TabsContent value="timeline" className="space-y-4">
              <Card className="p-6 border border-border/20">
                <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Project Timeline
                </h3>
                <div className="space-y-4">
                  {analysisData.timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).replace('text-', 'bg-').replace('/20', '')}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{item.event}</span>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <Badge className={`mt-1 ${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
