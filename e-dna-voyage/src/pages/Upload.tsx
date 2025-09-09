import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AbyssBackground } from '@/components/AbyssBackground';
import { Upload as UploadIcon, FileText, MapPin, Calendar, CheckCircle, ArrowRight, Dna } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  uploadProgress: number;
}

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newFile: UploadedFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type || 'Unknown',
        uploadProgress: 0,
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === newFile.name ? { ...f, uploadProgress: progress } : f
          )
        );
      }, 200);
    });

    toast({
      title: "Files uploaded successfully",
      description: `${files.length} file(s) added to analysis queue`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Your eDNA samples have been processed successfully",
      });
      // Auto-navigate to results with a tiny delay
      setTimeout(() => navigate('/results'), 800);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
              Upload eDNA Samples
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your environmental DNA samples for AI-powered analysis. 
              Our advanced pipeline will identify known and novel marine species from your data.
            </p>
          </div>

          {/* Upload Area */}
          <Card className="deep-card p-8 mb-8 border border-border/20">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">
                Drop your eDNA files here
              </h3>
              <p className="text-muted-foreground mb-6">
                Supports FASTA, FASTQ, CSV, and other genomic data formats
              </p>
              
              <input
                type="file"
                multiple
                accept=".fasta,.fastq,.csv,.txt,.fa,.fq"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent">
                  Choose Files
                </Button>
              </label>
            </div>
          </Card>

          {/* Sample Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="deep-card p-6 border border-border/20">
              <MapPin className="w-8 h-8 text-bioluminescent-teal mb-3" />
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">
                Sample Location
              </h3>
              <p className="text-sm text-muted-foreground">
                Add GPS coordinates and depth information for better analysis context
              </p>
            </Card>
            
            <Card className="deep-card p-6 border border-border/20">
              <Calendar className="w-8 h-8 text-coral-glow mb-3" />
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">
                Collection Date
              </h3>
              <p className="text-sm text-muted-foreground">
                Timestamp helps correlate findings with environmental conditions
              </p>
            </Card>
            
            <Card className="deep-card p-6 border border-border/20">
              <Dna className="w-8 h-8 text-bioluminescent-purple mb-3" />
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">
                DNA Quality
              </h3>
              <p className="text-sm text-muted-foreground">
                Higher quality samples yield more accurate species identification
              </p>
            </Card>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="deep-card p-6 mb-8 border border-border/20">
              <h3 className="text-xl font-montserrat font-semibold mb-4 text-foreground">
                Uploaded Files
              </h3>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                    <FileText className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-foreground">{file.name}</span>
                        <span className="text-sm text-muted-foreground">{file.size}</span>
                      </div>
                      <Progress value={file.uploadProgress} className="h-2" />
                    </div>
                    {file.uploadProgress === 100 && (
                      <CheckCircle className="w-5 h-5 text-species-glow" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Processing Controls */}
          {uploadedFiles.length > 0 && (
            <Card className="deep-card p-6 border border-border/20">
              <div className="text-center">
                {!isProcessing && !processingComplete && (
                  <>
                    <h3 className="text-xl font-montserrat font-semibold mb-4 text-foreground">
                      Ready for Analysis
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {uploadedFiles.length} file(s) uploaded and ready for AI processing
                    </p>
                    <Button
                      onClick={startProcessing}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent font-montserrat px-8"
                    >
                      <Dna className="w-5 h-5 mr-2" />
                      Start AI Analysis
                    </Button>
                  </>
                )}

                {isProcessing && (
                  <>
                    <h3 className="text-xl font-montserrat font-semibold mb-4 text-primary">
                      Processing Your Samples...
                    </h3>
                    <div className="animate-pulse-bioluminescent mb-4">
                      <Dna className="w-12 h-12 text-primary mx-auto animate-glow" />
                    </div>
                    <p className="text-muted-foreground mb-6">
                      AI algorithms are analyzing genetic sequences and identifying species patterns
                    </p>
                    <div className="max-w-md mx-auto">
                      <Progress value={75} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-2">Estimated time: 3-5 minutes</p>
                    </div>
                  </>
                )}

                {processingComplete && (
                  <>
                    <CheckCircle className="w-16 h-16 text-species-glow mx-auto mb-4 animate-pulse-bioluminescent" />
                    <h3 className="text-xl font-montserrat font-semibold mb-4 text-species-glow">
                      Analysis Complete!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your eDNA samples have been successfully analyzed. 
                      View detailed results including novel species discoveries.
                    </p>
                    <Link to="/results">
                      <Button
                        size="lg"
                        className="bg-species-glow hover:bg-species-glow/90 text-primary-foreground shadow-species font-montserrat px-8"
                      >
                        View Results
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Getting Started Guide */}
          {uploadedFiles.length === 0 && (
            <Card className="deep-card p-8 border border-border/20">
              <h3 className="text-2xl font-montserrat font-semibold mb-6 text-center text-accent">
                Getting Started with eDNA Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-montserrat font-medium mb-3 text-foreground">
                    Supported File Types
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• FASTA sequences (.fasta, .fa)</li>
                    <li>• FASTQ quality files (.fastq, .fq)</li>
                    <li>• CSV data tables (.csv)</li>
                    <li>• Raw text files (.txt)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-montserrat font-medium mb-3 text-foreground">
                    Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Include metadata with samples</li>
                    <li>• Use high-quality DNA extractions</li>
                    <li>• Provide location coordinates</li>
                    <li>• Note collection conditions</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;