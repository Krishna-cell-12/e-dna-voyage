import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  User, 
  Mail, 
  Plus, 
  Trash2,
  Users,
  CheckCircle
} from 'lucide-react';

interface CollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onAddCollaborator: (collaborator: {
    userId: string;
    collaboratorId: string;
    projectName: string;
    email: string;
    role: string;
    notes?: string;
  }) => void;
}

const CollaboratorModal: React.FC<CollaboratorModalProps> = ({ 
  isOpen, 
  onClose, 
  projectName, 
  onAddCollaborator 
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    collaboratorId: '',
    email: '',
    role: 'researcher',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAddCollaborator({
        userId: formData.userId,
        collaboratorId: formData.collaboratorId,
        projectName: projectName,
        email: formData.email,
        role: formData.role,
        notes: formData.notes
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          userId: '',
          collaboratorId: '',
          email: '',
          role: 'researcher',
          notes: ''
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding collaborator:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userId: '',
      collaboratorId: '',
      email: '',
      role: 'researcher',
      notes: ''
    });
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat font-bold text-foreground">
              Add Collaborator
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Collaborator Added Successfully!
            </h3>
            <p className="text-muted-foreground">
              The collaborator has been added to {projectName}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name Display */}
            <Card className="p-4 bg-muted/10 border border-border/20">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Project:</span>
                <Badge className="bg-primary/20 text-primary">{projectName}</Badge>
              </div>
            </Card>

            {/* User ID */}
            <div>
              <Label htmlFor="userId" className="text-foreground">Your User ID *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Collaborator ID */}
            <div>
              <Label htmlFor="collaboratorId" className="text-foreground">Collaborator ID *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="collaboratorId"
                  type="text"
                  placeholder="Enter collaborator's user ID"
                  value={formData.collaboratorId}
                  onChange={(e) => handleInputChange('collaboratorId', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-foreground">Collaborator Email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter collaborator's email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" className="text-foreground">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-card border border-border/20 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="researcher">Researcher</option>
                <option value="student">Student</option>
                <option value="institution">Institution</option>
                <option value="admin">Admin</option>
                <option value="observer">Observer</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-foreground">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this collaboration..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting || !formData.userId || !formData.collaboratorId || !formData.email}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Collaborator
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorModal;
