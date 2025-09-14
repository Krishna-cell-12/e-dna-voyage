import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  User, 
  Mail, 
  Building, 
  MapPin, 
  FileText,
  Save,
  Camera,
  CheckCircle,
  Award,
  FolderOpen,
  Globe,
  Search
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateProfile } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    institution: '',
    location: '',
    bio: '',
    publications: '',
    citations: '',
    createdProjects: '',
    countries: '',
    recentDiscoveries: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        institution: user.institution || '',
        location: user.location || '',
        bio: user.bio || '',
        publications: user.publications || '',
        citations: user.citations || '',
        createdProjects: user.createdProjects || '',
        countries: user.countries || '',
        recentDiscoveries: user.recentDiscoveries || ''
      });
      setProfileImage(user.avatar || null);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      if (updateProfile) {
        updateProfile({
          ...formData,
          avatar: profileImage
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user',
      institution: user?.institution || '',
      location: user?.location || '',
      bio: user?.bio || ''
    });
    setProfileImage(user?.avatar || null);
    setImageFile(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat font-bold text-foreground">
              Edit Profile
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
              Profile Updated Successfully!
            </h3>
            <p className="text-muted-foreground">
              Your profile changes have been saved
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <Card className="p-6 border border-border/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-bioluminescent-teal flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label htmlFor="profile-image-upload">
                    <Button
                      type="button"
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                      asChild
                    >
                      <span>
                        <Camera className="w-4 h-4" />
                      </span>
                    </Button>
                  </label>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a new profile picture
                  </p>
                  <label htmlFor="profile-image-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        Choose File
                      </span>
                    </Button>
                  </label>
                  {imageFile && (
                    <p className="text-xs text-primary mt-1">
                      {imageFile.name} selected
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6 border border-border/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-6 border border-border/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Professional Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institution" className="text-foreground">Institution</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="institution"
                      type="text"
                      placeholder="Enter your institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-foreground">Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="bio" className="text-foreground">Bio</Label>
                <div className="relative mt-1">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="pl-10 min-h-[100px]"
                  />
                </div>
              </div>
            </Card>

            {/* Research & Professional Information */}
            <Card className="p-6 border border-border/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Research & Professional Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publications" className="text-foreground">Publications</Label>
                  <div className="relative mt-1">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="publications"
                      type="text"
                      placeholder="e.g., 15 research papers, 3 books"
                      value={formData.publications}
                      onChange={(e) => handleInputChange('publications', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="citations" className="text-foreground">Citations</Label>
                  <div className="relative mt-1">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="citations"
                      type="text"
                      placeholder="e.g., 250 citations, h-index: 8"
                      value={formData.citations}
                      onChange={(e) => handleInputChange('citations', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="createdProjects" className="text-foreground">Created Projects</Label>
                  <div className="relative mt-1">
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="createdProjects"
                      type="text"
                      placeholder="e.g., 12 research projects, 5 ongoing"
                      value={formData.createdProjects}
                      onChange={(e) => handleInputChange('createdProjects', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="countries" className="text-foreground">Countries Worked In</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="countries"
                      type="text"
                      placeholder="e.g., USA, Japan, Australia, Brazil"
                      value={formData.countries}
                      onChange={(e) => handleInputChange('countries', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="recentDiscoveries" className="text-foreground">Recent Discoveries</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="recentDiscoveries"
                    placeholder="Describe your recent discoveries or research findings. If none, write 'No recent discoveries'"
                    value={formData.recentDiscoveries}
                    onChange={(e) => handleInputChange('recentDiscoveries', e.target.value)}
                    className="pl-10 min-h-[100px]"
                  />
                </div>
              </div>
            </Card>

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
                disabled={isSubmitting || !formData.name || !formData.email}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
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

export default EditProfileModal;
