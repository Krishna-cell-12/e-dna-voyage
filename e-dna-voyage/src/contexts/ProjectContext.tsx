import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
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
  image: string;
  tags: string[];
  relatedFiles: string[];
  collaboratorEmails: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  getProject: (projectId: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

// Sample projects data
const initialProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Mariana Trench Biodiversity Survey',
    description: 'Comprehensive eDNA analysis of the deepest ocean trench to catalog extreme depth marine life and discover new species adapted to hadal zone conditions.',
    location: 'Mariana Trench, Pacific Ocean',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
    collaborators: 12,
    samples: 47,
    novelSpecies: 23,
    image: '/api/placeholder/400/200',
    tags: ['Deep Sea', 'Hadal Zone', 'Extremophiles'],
    relatedFiles: [],
    collaboratorEmails: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj-002',
    name: 'Arctic Deep Water Exploration',
    description: 'Investigating climate change impacts on Arctic deep-sea biodiversity through seasonal eDNA sampling and AI-driven species identification.',
    location: 'Arctic Ocean Basin',
    startDate: '2023-09-15',
    endDate: '2024-03-15',
    status: 'completed',
    collaborators: 8,
    samples: 34,
    novelSpecies: 18,
    image: '/api/placeholder/400/200',
    tags: ['Arctic', 'Climate Change', 'Seasonal'],
    relatedFiles: [],
    collaboratorEmails: [],
    createdAt: '2023-09-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'proj-003',
    name: 'Abyssal Plains Microbiome Study',
    description: 'Large-scale analysis of microbial diversity in abyssal sediments to understand deep-sea ecosystem functioning and nutrient cycling.',
    location: 'North Pacific Abyssal Plains',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    status: 'active',
    collaborators: 15,
    samples: 89,
    novelSpecies: 45,
    image: '/api/placeholder/400/200',
    tags: ['Microbiome', 'Sediment', 'Ecosystem'],
    relatedFiles: [],
    collaboratorEmails: [],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'proj-004',
    name: 'Mid-Atlantic Ridge Hydrothermal Vents',
    description: 'Characterizing unique chemosynthetic communities around active hydrothermal vents using next-generation eDNA sequencing techniques.',
    location: 'Mid-Atlantic Ridge',
    startDate: '2024-07-01',
    endDate: '2025-01-31',
    status: 'draft',
    collaborators: 6,
    samples: 0,
    novelSpecies: 0,
    image: '/api/placeholder/400/200',
    tags: ['Hydrothermal', 'Chemosynthesis', 'Vents'],
    relatedFiles: [],
    collaboratorEmails: [],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  }
];

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Load projects from localStorage on initialization
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e-dna-projects');
      if (saved) {
        try {
          const parsedProjects = JSON.parse(saved);
          // Merge with initial projects, avoiding duplicates
          const existingIds = new Set(parsedProjects.map((p: Project) => p.id));
          const newInitialProjects = initialProjects.filter(p => !existingIds.has(p.id));
          return [...parsedProjects, ...newInitialProjects];
        } catch (error) {
          console.error('Error parsing saved projects:', error);
          return initialProjects;
        }
      }
    }
    return initialProjects;
  });

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('e-dna-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProject = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
