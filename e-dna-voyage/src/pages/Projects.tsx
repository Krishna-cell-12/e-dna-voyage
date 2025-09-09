import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AbyssBackground } from '@/components/AbyssBackground';
import { 
  FolderOpen, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  BarChart3,
  Eye,
  Settings,
  Star,
  Dna,
  Fish
} from 'lucide-react';

interface Project {
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
}

const Projects = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');

  const projects: Project[] = [
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
      tags: ['Deep Sea', 'Hadal Zone', 'Extremophiles']
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
      tags: ['Arctic', 'Climate Change', 'Seasonal']
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
      tags: ['Microbiome', 'Sediment', 'Ecosystem']
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
      tags: ['Hydrothermal', 'Chemosynthesis', 'Vents']
    }
  ];

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-species-glow/20 text-species-glow';
      case 'completed': return 'bg-primary/20 text-primary';
      case 'draft': return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-4">
              Research Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Explore ongoing deep-sea research initiatives, track discoveries, and collaborate on marine biodiversity studies.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="deep-card p-6 border border-border/20 text-center">
            <FolderOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary mb-1">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </Card>
          <Card className="deep-card p-6 border border-border/20 text-center">
            <Dna className="w-8 h-8 text-bioluminescent-teal mx-auto mb-2" />
            <div className="text-2xl font-bold text-bioluminescent-teal mb-1">
              {projects.reduce((sum, p) => sum + p.samples, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Samples Analyzed</div>
          </Card>
          <Card className="deep-card p-6 border border-border/20 text-center">
            <Star className="w-8 h-8 text-coral-glow mx-auto mb-2" />
            <div className="text-2xl font-bold text-coral-glow mb-1">
              {projects.reduce((sum, p) => sum + p.novelSpecies, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Novel Species</div>
          </Card>
          <Card className="deep-card p-6 border border-border/20 text-center">
            <Users className="w-8 h-8 text-species-glow mx-auto mb-2" />
            <div className="text-2xl font-bold text-species-glow mb-1">
              {projects.reduce((sum, p) => sum + p.collaborators, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Collaborators</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {(['all', 'active', 'completed', 'draft'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? 'bg-primary text-primary-foreground shadow-bioluminescent' : ''}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {projects.filter(p => p.status === status).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="deep-card border border-border/20 overflow-hidden hover:shadow-bioluminescent transition-all duration-300">
              {/* Project Header */}
              <div className="p-6 border-b border-border/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-montserrat font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                
                {/* Project Details */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {project.startDate} - {project.endDate}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {project.collaborators} collaborators
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fish className="w-4 h-4" />
                    {project.samples} samples
                  </div>
                </div>
              </div>

              {/* Project Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{project.samples}</div>
                    <div className="text-xs text-muted-foreground">Samples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-coral-glow">{project.novelSpecies}</div>
                    <div className="text-xs text-muted-foreground">Novel Species</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-bioluminescent-teal">{project.collaborators}</div>
                    <div className="text-xs text-muted-foreground">Team Size</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/results?project=${project.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/results?project=${project.id}`}>
                    <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Results
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="deep-card p-12 text-center border border-border/20">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-montserrat font-semibold mb-2 text-foreground">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              No projects match your current filter. Try selecting a different status or create a new project.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Project
            </Button>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <Card className="deep-card p-8 border border-border/20">
            <h3 className="text-2xl font-montserrat font-semibold mb-6 text-center text-accent">
              Start Your Deep Sea Research
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/upload">
                <Card className="p-6 text-center hover:shadow-species transition-all duration-300 cursor-pointer border border-border/20">
                  <Dna className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h4 className="font-montserrat font-medium mb-2 text-foreground">
                    Upload Samples
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading your eDNA samples for AI analysis
                  </p>
                </Card>
              </Link>
              
              <Link to="/results">
                <Card className="p-6 text-center hover:shadow-species transition-all duration-300 cursor-pointer border border-border/20">
                  <BarChart3 className="w-12 h-12 text-bioluminescent-teal mx-auto mb-3" />
                  <h4 className="font-montserrat font-medium mb-2 text-foreground">
                    View Results
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Explore analysis results and discover novel species
                  </p>
                </Card>
              </Link>
              
              <Card className="p-6 text-center hover:shadow-species transition-all duration-300 cursor-pointer border border-border/20">
                <Users className="w-12 h-12 text-coral-glow mx-auto mb-3" />
                <h4 className="font-montserrat font-medium mb-2 text-foreground">
                  Collaborate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Join research teams and share discoveries globally
                </p>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Projects;