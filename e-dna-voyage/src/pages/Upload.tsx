import { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AbyssBackground } from '@/components/AbyssBackground';
import { useAnalysis, type UploadedFile, type AnalysisResult } from '@/contexts/AnalysisContext';
import { getCurrentLocation, formatLocation } from '@/services/locationService';
import { Upload as UploadIcon, FileText, CheckCircle, ArrowRight, Dna, File, HelpCircle, X, Download, Eye, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    uploadedFiles, 
    analysisResults, 
    addUploadedFile, 
    removeUploadedFile, 
    updateUploadedFile,
    addAnalysisResult, 
    updateAnalysisResult 
  } = useAnalysis();

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

  const handleFiles = async (files: File[]) => {
    try {
      // Get user's current location
      const location = await getCurrentLocation();
      
      files.forEach((file) => {
        const fileId = Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type || 'Unknown',
          uploadProgress: 0,
          file: file,
          location: location,
        };

        addUploadedFile(newFile);
        
        // Simulate upload progress with visual feedback
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          
          // Update the uploaded file progress in context
          updateUploadedFile(newFile.id, { uploadProgress: progress });
        }, 200);
      });

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) added to analysis queue with location data`,
      });
    } catch (error) {
      // If location access fails, still upload files without location
      console.warn('Location access failed:', error);
      
      files.forEach((file) => {
        const fileId = Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          type: file.type || 'Unknown',
          uploadProgress: 0,
          file: file,
        };

        addUploadedFile(newFile);
        
        // Simulate upload progress with visual feedback
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          
          // Update the uploaded file progress in context
          updateUploadedFile(newFile.id, { uploadProgress: progress });
        }, 200);
      });

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) added to analysis queue (location access denied)`,
        variant: "default",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setShowResults(true);
    
    // Generate comprehensive mock analysis results
    const mockResults: AnalysisResult[] = uploadedFiles.map((file, index) => {
      const speciesList = [
        'Tursiops truncatus (Common Bottlenose Dolphin)',
        'Carcharodon carcharias (Great White Shark)',
        'Manta birostris (Giant Manta Ray)',
        'Chelonia mydas (Green Sea Turtle)',
        'Megaptera novaeangliae (Humpback Whale)',
        'Orcinus orca (Killer Whale)',
        'Balaenoptera musculus (Blue Whale)',
        'Dermochelys coriacea (Leatherback Turtle)',
        'Zalophus californianus (California Sea Lion)',
        'Phoca vitulina (Harbor Seal)'
      ];
      
      const sequences = [
        'ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG',
        'GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA',
        'TAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC',
        'CGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA',
        'GATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC'
      ];
      
      return {
        id: `result-${file.id}`,
        fileName: file.name,
        species: speciesList[index % speciesList.length],
        confidence: Math.random() * 35 + 65, // 65-100%
        sequence: sequences[index % sequences.length],
        quality: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
        status: 'Processing' as const,
        timestamp: new Date().toISOString(),
        totalSequences: Math.floor(Math.random() * 100000) + 50000,
        knownSpecies: Math.floor(Math.random() * 50) + 20,
        novelSpecies: Math.floor(Math.random() * 20) + 5,
        location: file.location ? formatLocation(file.location) : 'Unknown Location',
        date: new Date().toISOString().split('T')[0],
      };
    });
    
    // Add all results to context
    mockResults.forEach(result => addAnalysisResult(result));
    
    // Simulate detailed processing stages
    const processingStages = [
      { delay: 1000, message: "Initializing DNA sequence analysis..." },
      { delay: 2000, message: "Comparing against marine species database..." },
      { delay: 3000, message: "Running phylogenetic analysis..." },
      { delay: 4000, message: "Calculating confidence scores..." },
      { delay: 5000, message: "Generating comprehensive report..." }
    ];
    
    processingStages.forEach((stage, index) => {
      setTimeout(() => {
        if (index === processingStages.length - 1) {
          setIsProcessing(false);
          setProcessingComplete(true);
          
          // Update results to complete status with enhanced data
          mockResults.forEach(result => {
            updateAnalysisResult(result.id, { 
              status: 'Complete' as const,
              confidence: Math.min(100, result.confidence + Math.random() * 5) // Slight confidence boost
            });
          });
          
          toast({
            title: "Analysis Complete",
            description: `Successfully analyzed ${uploadedFiles.length} file(s) and identified ${mockResults.length} species`,
          });
        }
      }, stage.delay);
    });
  };

  const removeFile = (fileId: string) => {
    removeUploadedFile(fileId);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <UploadIcon className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                Drop your eDNA files here or click to browse
              </h3>
              <p className="text-muted-foreground mb-6 group-hover:text-foreground transition-colors">
                Supports FASTA, FASTQ, CSV, and other genomic data formats
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".fasta,.fastq,.csv,.txt,.fa,.fq"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent hover:shadow-lg hover:scale-105 transition-all duration-300 font-montserrat px-8 py-3"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                size="lg"
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Click anywhere in this area or use the button above
              </p>
            </div>
          </Card>

          {/* Sample Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="deep-card p-6 border border-border/20">
              <Dna className="w-8 h-8 text-bioluminescent-purple mb-3" />
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">
                DNA Quality
              </h3>
              <p className="text-sm text-muted-foreground">
                Higher quality samples yield more accurate species identification
              </p>
            </Card>
            
            <Card className="deep-card p-6 border border-border/20">
              <File className="w-8 h-8 text-bioluminescent-teal mb-3" />
              <h3 className="font-montserrat font-semibold mb-2 text-foreground">
                File Upload Information
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you have any doubt on what file type to upload and how{' '}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-primary hover:text-primary/80 underline font-medium">
                      click here
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-montserrat font-semibold text-center text-accent">
                        Getting Started with eDNA Analysis
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
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
                  </DialogContent>
                </Dialog>
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
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                    <FileText className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-foreground">{file.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{file.size}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {file.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span>{formatLocation(file.location)}</span>
                          </div>
                        )}
                      <div className="space-y-1">
                        <Progress 
                          value={file.uploadProgress} 
                          className={`h-2 ${
                            file.uploadProgress === 100 
                              ? '[&>div]:bg-green-500 [&>div]:animate-pulse' 
                              : '[&>div]:bg-primary'
                          }`} 
                        />
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {file.uploadProgress === 100 ? 'Upload Complete' : 'Uploading...'}
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(file.uploadProgress)}%
                          </span>
                        </div>
                      </div>
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

          {/* Analysis Results */}
          {showResults && analysisResults.length > 0 && (
            <Card className="deep-card p-6 mb-8 border border-border/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-montserrat font-semibold text-foreground">
                  DNA Analysis Results
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    {analysisResults.length} species identified
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    processingComplete 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {processingComplete ? 'Analysis Complete' : 'Processing...'}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResults.map((result) => (
                  <Card key={result.id} className="p-6 border border-border/20 bg-muted/10 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Dna className="w-6 h-6 text-primary" />
                        <div>
                          <span className="font-medium text-foreground text-sm block truncate">
                            {result.fileName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.status === 'Complete' 
                          ? 'bg-green-500/20 text-green-400' 
                          : result.status === 'Processing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {result.status}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-primary" />
                          Species Identified
                        </h4>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-sm text-foreground font-medium italic mb-1">
                            {result.species.split(' (')[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.species.split(' (')[1]?.replace(')', '')}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Confidence Score</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Accuracy</span>
                            <span className="text-sm font-medium text-foreground">
                              {result.confidence.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={result.confidence} className="h-3" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Sequence Quality</h4>
                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            result.quality === 'High' 
                              ? 'bg-green-500/20 text-green-400' 
                              : result.quality === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {result.quality} Quality
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.quality === 'High' ? 'Excellent' : result.quality === 'Medium' ? 'Good' : 'Fair'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">DNA Sequence</h4>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground font-mono break-all">
                            {result.sequence}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Length: {result.sequence.length} base pairs
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Analysis Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground">GC Content:</span>
                            <span className="text-foreground ml-1">{(Math.random() * 20 + 40).toFixed(1)}%</span>
                          </div>
                          <div className="bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground">Reads:</span>
                            <span className="text-foreground ml-1">{Math.floor(Math.random() * 10000 + 1000)}</span>
                          </div>
                          <div className="bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground">Coverage:</span>
                            <span className="text-foreground ml-1">{(Math.random() * 50 + 10).toFixed(1)}x</span>
                          </div>
                          <div className="bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground">Identity:</span>
                            <span className="text-foreground ml-1">{(Math.random() * 15 + 85).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 hover:bg-primary/10">
                          <Eye className="w-4 h-4 mr-1" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 hover:bg-primary/10">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {processingComplete && (
                <div className="mt-8 text-center space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Analysis Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Files Processed:</span>
                        <span className="text-foreground ml-1 font-medium">{uploadedFiles.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Species Found:</span>
                        <span className="text-foreground ml-1 font-medium">{analysisResults.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">High Quality:</span>
                        <span className="text-foreground ml-1 font-medium">
                          {analysisResults.filter(r => r.quality === 'High').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Confidence:</span>
                        <span className="text-foreground ml-1 font-medium">
                          {(analysisResults.reduce((acc, r) => acc + r.confidence, 0) / analysisResults.length).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="bg-species-glow hover:bg-species-glow/90 text-primary-foreground shadow-species font-montserrat px-8"
                    onClick={() => navigate('/results')}
                  >
                    View Detailed Results
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default Upload;