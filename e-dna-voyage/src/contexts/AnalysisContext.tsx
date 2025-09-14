import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadProgress: number;
  file: File;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  species: string;
  confidence: number;
  sequence: string;
  quality: 'High' | 'Medium' | 'Low';
  status: 'Processing' | 'Complete' | 'Error';
  timestamp: string;
  totalSequences: number;
  knownSpecies: number;
  novelSpecies: number;
  location?: string;
  date: string;
}

interface AnalysisContextType {
  uploadedFiles: UploadedFile[];
  analysisResults: AnalysisResult[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  updateUploadedFile: (fileId: string, updates: Partial<UploadedFile>) => void;
  addAnalysisResult: (result: AnalysisResult) => void;
  updateAnalysisResult: (resultId: string, updates: Partial<AnalysisResult>) => void;
  clearAllData: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  // Load data from localStorage on initialization
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e-dna-uploaded-files');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e-dna-analysis-results');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setAnalysisResults(prev => prev.filter(result => result.id !== `result-${fileId}`));
  };

  const updateUploadedFile = (fileId: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      )
    );
  };

  const addAnalysisResult = (result: AnalysisResult) => {
    setAnalysisResults(prev => [...prev, result]);
  };

  const updateAnalysisResult = (resultId: string, updates: Partial<AnalysisResult>) => {
    setAnalysisResults(prev => 
      prev.map(result => 
        result.id === resultId ? { ...result, ...updates } : result
      )
    );
  };

  const clearAllData = () => {
    setUploadedFiles([]);
    setAnalysisResults([]);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e-dna-uploaded-files', JSON.stringify(uploadedFiles));
    }
  }, [uploadedFiles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e-dna-analysis-results', JSON.stringify(analysisResults));
    }
  }, [analysisResults]);

  const value: AnalysisContextType = {
    uploadedFiles,
    analysisResults,
    addUploadedFile,
    removeUploadedFile,
    updateUploadedFile,
    addAnalysisResult,
    updateAnalysisResult,
    clearAllData,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
