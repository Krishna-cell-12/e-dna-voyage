import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AbyssBackground } from '@/components/AbyssBackground';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useProjects, type Project } from '@/contexts/ProjectContext';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import ProjectResultsModal from '@/components/ProjectResultsModal';
import CollaboratorModal from '@/components/CollaboratorModal';
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
  Fish,
  Search,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';


interface NewProjectForm {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  collaboratorEmails: string[];
  tags: string[];
  selectedFiles: string[];
}

const Projects = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    collaboratorEmails: [],
    tags: [],
    selectedFiles: []
  });
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showProjectResults, setShowProjectResults] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  
  // Collaborator data state
  const [collaborators, setCollaborators] = useState<Array<{
    id: string;
    userId: string;
    collaboratorId: string;
    projectName: string;
    email: string;
    role: string;
    notes?: string;
    addedAt: string;
  }>>([]);
  
  const { analysisResults, uploadedFiles } = useAnalysis();
  const { projects, addProject } = useProjects();


  // Filter projects based on selected status
  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  // Search for files based on query
  const searchResults = analysisResults.filter(result => 
    result.fileName.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleFormChange = (field: keyof NewProjectForm, value: any) => {
    setNewProjectForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add collaborator email
  const addCollaborator = () => {
    if (newCollaboratorEmail && !newProjectForm.collaboratorEmails.includes(newCollaboratorEmail)) {
      handleFormChange('collaboratorEmails', [...newProjectForm.collaboratorEmails, newCollaboratorEmail]);
      setNewCollaboratorEmail('');
    }
  };

  // Remove collaborator email
  const removeCollaborator = (email: string) => {
    handleFormChange('collaboratorEmails', newProjectForm.collaboratorEmails.filter(e => e !== email));
  };

  // Add tag
  const addTag = () => {
    if (newTag && !newProjectForm.tags.includes(newTag)) {
      handleFormChange('tags', [...newProjectForm.tags, newTag]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    handleFormChange('tags', newProjectForm.tags.filter(t => t !== tag));
  };

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    const isSelected = newProjectForm.selectedFiles.includes(fileId);
    if (isSelected) {
      handleFormChange('selectedFiles', newProjectForm.selectedFiles.filter(id => id !== fileId));
    } else {
      handleFormChange('selectedFiles', [...newProjectForm.selectedFiles, fileId]);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!newProjectForm.name.trim()) {
      errors.push('Project name is required');
    }
    
    if (!newProjectForm.startDate) {
      errors.push('Start date is required');
    }
    
    if (!newProjectForm.endDate) {
      errors.push('End date is required');
    }
    
    if (newProjectForm.startDate && newProjectForm.endDate) {
      const startDate = new Date(newProjectForm.startDate);
      const endDate = new Date(newProjectForm.endDate);
      
      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
    }
    
    return errors;
  };

  // Save new project
  const saveProject = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    const newProjectData = {
      name: newProjectForm.name,
      description: newProjectForm.description,
      location: newProjectForm.location,
      startDate: newProjectForm.startDate,
      endDate: newProjectForm.endDate,
      status: 'draft' as const,
      collaborators: newProjectForm.collaboratorEmails.length + 1, // +1 for creator
      samples: newProjectForm.selectedFiles.length,
      novelSpecies: 0, // Will be calculated from selected files
      image: '/api/placeholder/400/200',
      tags: newProjectForm.tags,
      relatedFiles: newProjectForm.selectedFiles,
      collaboratorEmails: newProjectForm.collaboratorEmails
    };

    addProject(newProjectData);
    
    // Reset form
    setNewProjectForm({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      collaboratorEmails: [],
      tags: [],
      selectedFiles: []
    });
    setFileSearchQuery('');
    setShowNewProjectDialog(false);
  };

  // Modal handlers
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleViewResults = (project: Project) => {
    setSelectedProject(project);
    setShowProjectResults(true);
  };

  const handleAddCollaborator = (collaboratorData: {
    userId: string;
    collaboratorId: string;
    projectName: string;
    email: string;
    role: string;
    notes?: string;
  }) => {
    const newCollaborator = {
      id: `collab-${Date.now()}`,
      ...collaboratorData,
      addedAt: new Date().toISOString()
    };
    setCollaborators(prev => [newCollaborator, ...prev]);
  };

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
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-montserrat font-bold text-foreground">
                  Create New Project
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* File Search Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Search Analysis Files
                  </h3>
                  <div className="relative">
                    <Input
                      placeholder="Search for files by name..."
                      value={fileSearchQuery}
                      onChange={(e) => setFileSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {/* Search Results */}
                  {fileSearchQuery && (
                    <div className="max-h-60 overflow-y-auto border border-border/20 rounded-lg">
                      {searchResults.length > 0 ? (
                        <div className="space-y-2 p-4">
                          {searchResults.map((result) => (
                            <div
                              key={result.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                newProjectForm.selectedFiles.includes(result.id)
                                  ? 'bg-primary/20 border-primary'
                                  : 'bg-muted/10 border-border/20 hover:bg-muted/20'
                              }`}
                              onClick={() => toggleFileSelection(result.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-foreground">{result.fileName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {result.species} • {result.confidence}% confidence • {result.status}
                                  </p>
                                </div>
                                {newProjectForm.selectedFiles.includes(result.id) && (
                                  <CheckCircle className="w-5 h-5 text-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          No files found matching "{fileSearchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Selected Files Summary */}
                  {newProjectForm.selectedFiles.length > 0 && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm text-primary font-medium">
                        {newProjectForm.selectedFiles.length} file(s) selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Project Details Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-name" className="text-foreground">Project Name *</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter unique project name"
                        value={newProjectForm.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project-location" className="text-foreground">Location</Label>
                      <Input
                        id="project-location"
                        placeholder="e.g., Mariana Trench, Pacific Ocean"
                        value={newProjectForm.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project-description" className="text-foreground">Description</Label>
                    <Textarea
                      id="project-description"
                      placeholder="Describe your research project..."
                      value={newProjectForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date" className="text-foreground font-medium">Start Date *</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newProjectForm.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        className={`mt-1 bg-card border-border/20 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                          newProjectForm.startDate && newProjectForm.endDate && 
                          new Date(newProjectForm.endDate) <= new Date(newProjectForm.startDate)
                            ? 'border-destructive focus:border-destructive'
                            : ''
                        }`}
                        min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Select when the project will begin
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="end-date" className="text-foreground font-medium">End Date *</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newProjectForm.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        className={`mt-1 bg-card border-border/20 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                          newProjectForm.startDate && newProjectForm.endDate && 
                          new Date(newProjectForm.endDate) <= new Date(newProjectForm.startDate)
                            ? 'border-destructive focus:border-destructive'
                            : ''
                        }`}
                        min={newProjectForm.startDate || new Date().toISOString().split('T')[0]} // End date must be after start date
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Select when the project will end
                      </p>
                      {newProjectForm.startDate && newProjectForm.endDate && 
                       new Date(newProjectForm.endDate) <= new Date(newProjectForm.startDate) && (
                        <p className="text-xs text-destructive mt-1">
                          End date must be after start date
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collaborators Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-bioluminescent-teal" />
                    Collaborators
                  </h3>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter collaborator email"
                      value={newCollaboratorEmail}
                      onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCollaborator()}
                    />
                    <Button onClick={addCollaborator} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {newProjectForm.collaboratorEmails.length > 0 && (
                    <div className="space-y-2">
                      {newProjectForm.collaboratorEmails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/10 rounded-lg">
                          <span className="text-sm text-foreground">{email}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCollaborator(email)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {newProjectForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProjectForm.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTag(tag)}
                            className="h-auto p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewProjectDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveProject}
                    disabled={!newProjectForm.name.trim() || !newProjectForm.startDate || !newProjectForm.endDate}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleViewDetails(project)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-accent text-accent hover:bg-accent/10"
                    onClick={() => handleViewResults(project)}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Results
                  </Button>
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
            <Button 
              onClick={() => setShowNewProjectDialog(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent"
            >
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
              
              <Card 
                className="p-6 text-center hover:shadow-species transition-all duration-300 cursor-pointer border border-border/20"
                onClick={() => setShowCollaboratorModal(true)}
              >
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

        {/* Collaborators Section */}
        {collaborators.length > 0 && (
          <div className="mt-12">
            <Card className="deep-card p-8 border border-border/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-montserrat font-semibold text-accent">
                  Project Collaborators
                </h3>
                <Button 
                  onClick={() => setShowCollaboratorModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collaborator
                </Button>
              </div>
              
              <div className="space-y-4">
                {collaborators.map((collaborator) => (
                  <Card key={collaborator.id} className="p-4 border border-border/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-medium text-foreground">
                              {collaborator.collaboratorId}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {collaborator.email} • {collaborator.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Project: {collaborator.projectName}</span>
                          <span>Added: {new Date(collaborator.addedAt).toLocaleDateString()}</span>
                        </div>
                        {collaborator.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{collaborator.notes}"
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => setCollaborators(prev => prev.filter(c => c.id !== collaborator.id))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          isOpen={showProjectDetails}
          onClose={() => {
            setShowProjectDetails(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      {/* Project Results Modal */}
      {selectedProject && (
        <ProjectResultsModal
          isOpen={showProjectResults}
          onClose={() => {
            setShowProjectResults(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      {/* Collaborator Modal */}
      <CollaboratorModal
        isOpen={showCollaboratorModal}
        onClose={() => setShowCollaboratorModal(false)}
        projectName={selectedProject?.name || 'Selected Project'}
        onAddCollaborator={handleAddCollaborator}
      />
    </div>
  );
};

export default Projects;