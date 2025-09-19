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
  Star,
  Download,
  Share2,
  Microscope,
  TrendingUp,
  Activity,
  FileText,
  Database
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProjectResultsModalProps {
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

const ProjectResultsModal: React.FC<ProjectResultsModalProps> = ({ isOpen, onClose, project }) => {
  // Mock file analysis results
  const fileAnalysisResults = [
    {
      id: 'file-001',
      fileName: 'Mariana_Trench_Sample_001.fastq',
      fileSize: '2.4 GB',
      uploadDate: '2024-01-15',
      analysisStatus: 'completed',
      totalSequences: 156789,
      knownSpecies: 87,
      novelSpecies: 23,
      confidence: 94.7,
      qualityScore: 92.3,
      processingTime: '4h 23m'
    },
    {
      id: 'file-002',
      fileName: 'Abyssal_Plain_Sample_002.fastq',
      fileSize: '3.1 GB',
      uploadDate: '2024-01-12',
      analysisStatus: 'completed',
      totalSequences: 203456,
      knownSpecies: 112,
      novelSpecies: 31,
      confidence: 91.2,
      qualityScore: 89.7,
      processingTime: '5h 12m'
    },
    {
      id: 'file-003',
      fileName: 'Hadal_Zone_Sample_003.fastq',
      fileSize: '1.8 GB',
      uploadDate: '2024-01-10',
      analysisStatus: 'processing',
      totalSequences: 89234,
      knownSpecies: 45,
      novelSpecies: 18,
      confidence: 89.8,
      qualityScore: 87.4,
      processingTime: '3h 45m'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-primary/20 text-primary';
      case 'processing': return 'bg-species-glow/20 text-species-glow';
      case 'failed': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-primary';
    if (score >= 80) return 'text-bioluminescent-teal';
    if (score >= 70) return 'text-coral-glow';
    return 'text-destructive';
  };

  const handleExportAll = async () => {
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
      doc.setFontSize(18); doc.text(`${project.name} – Results`, 40, y); y += 24;
      doc.setFontSize(11); doc.text(`${project.description || ''}`, 40, y); y += 18;
      const overview = [
        `Files Analyzed: ${fileAnalysisResults.length}`,
        `Total Sequences: ${fileAnalysisResults.reduce((s,f)=>s+f.totalSequences,0).toLocaleString()}`,
        `Novel Species: ${fileAnalysisResults.reduce((s,f)=>s+f.novelSpecies,0)}`,
        `Avg Confidence: ${Math.round(fileAnalysisResults.reduce((s,f)=>s+f.confidence,0)/fileAnalysisResults.length)}%`,
      ];
      overview.forEach((t) => { doc.setFontSize(12); doc.text(t, 40, y); y += 16; });
      y += 8;
      doc.setFontSize(14); doc.text('File Analysis', 40, y); y += 18;
      doc.setFontSize(11);
      fileAnalysisResults.forEach((f) => {
        [
          `File: ${f.fileName}`,
          `Status: ${f.analysisStatus}`,
          `Total Sequences: ${f.totalSequences.toLocaleString()}`,
          `Known: ${f.knownSpecies}`,
          `Novel: ${f.novelSpecies}`,
          `Quality: ${f.qualityScore}%`,
          `Uploaded: ${f.uploadDate}`,
          `Processing Time: ${f.processingTime}`,
        ].forEach((t) => { doc.text(t, 40, y); y += 14; });
        y += 6;
        if (y > doc.internal.pageSize.getHeight() - 72) { doc.addPage(); y = 48; }
      });
      doc.setFontSize(10);
      doc.text(`Exported ${new Date().toLocaleString()}`, 40, doc.internal.pageSize.getHeight() - 24);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${project.name.replace(/\s+/g,'_')}_results.pdf`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'PDF downloaded with results details.' });
    } catch (err) {
      toast({ title: 'Export failed', description: 'Could not generate the results PDF.' });
    }
  };

  const handleShareResults = async () => {
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
      doc.setFontSize(18); doc.text(`${project.name} – Results`, 40, y); y += 24;
      doc.setFontSize(12);
      [
        `Files: ${fileAnalysisResults.length}`,
        `Total Sequences: ${fileAnalysisResults.reduce((s,f)=>s+f.totalSequences,0).toLocaleString()}`,
        `Novel Species: ${fileAnalysisResults.reduce((s,f)=>s+f.novelSpecies,0)}`,
      ].forEach((t) => { doc.text(t, 40, y); y += 16; });
      const blob = doc.output('blob');
      const file = new File([blob], `${project.name.replace(/\s+/g,'_')}_results.pdf`, { type: 'application/pdf' });
      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ title: `${project.name} – Results`, text: 'eDNA results PDF', files: [file] });
        return;
      }
      const shareUrl = `${window.location.origin}/results?projectId=${encodeURIComponent(project.id)}`;
      if (navigator.share) {
        await navigator.share({ title: `${project.name} – Results`, text: 'eDNA results', url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: 'Link copied', description: 'Results link copied to clipboard.' });
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
              {project.name} - File Analysis Results
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
                <Button size="sm" variant="outline" onClick={handleExportAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                <Button size="sm" variant="outline" onClick={handleShareResults}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{fileAnalysisResults.length}</div>
                <div className="text-sm text-muted-foreground">Files Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-bioluminescent-teal mb-1">
                  {fileAnalysisResults.reduce((sum, file) => sum + file.totalSequences, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Sequences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-coral-glow mb-1">
                  {fileAnalysisResults.reduce((sum, file) => sum + file.novelSpecies, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Novel Species</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-species-glow mb-1">
                  {Math.round(fileAnalysisResults.reduce((sum, file) => sum + file.confidence, 0) / fileAnalysisResults.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
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
                <Database className="w-4 h-4" />
                {fileAnalysisResults.reduce((sum, file) => sum + parseFloat(file.fileSize), 0).toFixed(1)} GB total
              </div>
            </div>
          </Card>

          {/* File Analysis Results */}
          <Tabs defaultValue="files" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-card/50">
              <TabsTrigger value="files">File Analysis</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* File Analysis Tab */}
            <TabsContent value="files" className="space-y-4">
              <div className="space-y-4">
                {fileAnalysisResults.map((file, index) => (
                  <Card key={file.id} className="p-6 border border-border/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">{file.fileName}</h4>
                          <Badge className={getStatusColor(file.analysisStatus)}>
                            {file.analysisStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>Size: {file.fileSize}</span>
                          <span>Uploaded: {file.uploadDate}</span>
                          <span>Processing: {file.processingTime}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary mb-1">{file.totalSequences.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Sequences</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-bioluminescent-teal mb-1">{file.knownSpecies}</div>
                        <div className="text-xs text-muted-foreground">Known Species</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-coral-glow mb-1">{file.novelSpecies}</div>
                        <div className="text-xs text-muted-foreground">Novel Species</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold mb-1 ${getQualityColor(file.qualityScore)}`}>{file.qualityScore}%</div>
                        <div className="text-xs text-muted-foreground">Quality Score</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Analysis Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Files Processed</span>
                      <span className="font-medium text-foreground">{fileAnalysisResults.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Processing Time</span>
                      <span className="font-medium text-bioluminescent-teal">13h 20m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Quality Score</span>
                      <span className="font-medium text-coral-glow">89.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-species-glow">100%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Fish className="w-5 h-5 text-bioluminescent-teal" />
                    Species Discovery
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Species Found</span>
                      <span className="font-medium text-foreground">244</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Novel Species</span>
                      <span className="font-medium text-coral-glow">72</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Discovery Rate</span>
                      <span className="font-medium text-species-glow">29.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">High Confidence</span>
                      <span className="font-medium text-primary">91.2%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="p-6 border border-border/20">
                <h3 className="text-lg font-semibold mb-6 text-foreground flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-bioluminescent-purple" />
                  Analysis Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
                    <h4 className="font-medium text-foreground mb-2">Key Findings</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• High diversity of deep-sea organisms detected across all samples</li>
                      <li>• Significant presence of previously unknown species in hadal zones</li>
                      <li>• Strong correlation between depth and species novelty</li>
                      <li>• Excellent DNA preservation quality in all analyzed samples</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/10 border border-border/20">
                    <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Continue sampling in deeper regions for novel species discovery</li>
                      <li>• Focus on taxonomic classification of high-confidence novel species</li>
                      <li>• Consider expanding sampling to adjacent geological formations</li>
                      <li>• Implement real-time analysis pipeline for future expeditions</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectResultsModal;
