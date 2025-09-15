import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AbyssBackground } from '@/components/AbyssBackground';
import { useUser } from '@/contexts/UserContext';
import EditProfileModal from '@/components/EditProfileModal';
import { 
  ChangePasswordModal, 
  EmailVerificationModal, 
  DownloadDataModal, 
  EmailNotificationsModal 
} from '@/components/SettingsModals';
import { 
  User, 
  Settings, 
  Award, 
  BarChart3, 
  MapPin, 
  Calendar,
  Star,
  Dna,
  Fish,
  Eye,
  Users,
  Camera,
  Edit3,
  Mail,
  Globe,
  Download,
  CheckCircle,
  FileText,
  FolderOpen,
  Lock,
  Shield,
  Bell
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  
  // Settings modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showDownloadData, setShowDownloadData] = useState(false);
  const [showEmailNotifications, setShowEmailNotifications] = useState(false);
  
  const { user, isAuthenticated, logout, updateProfile } = useUser();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatar: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const startEditName = () => {
    setEditedName(user?.name || '');
    setIsEditingName(true);
  };

  const saveName = () => {
    if (!editedName.trim()) return;
    updateProfile({ name: editedName.trim() });
    setIsEditingName(false);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditedName('');
  };


  const achievements = [
    {
      icon: Star,
      title: 'Deep Sea Pioneer',
      description: 'First to discover novel species in Mariana Trench',
      date: '2024-01-15',
      color: 'text-coral-glow'
    },
    {
      icon: Dna,
      title: 'Sequence Master',
      description: 'Analyzed over 1 million DNA sequences',
      date: '2024-01-10',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Collaboration Champion',
      description: 'Participated in 20+ international projects',
      date: '2023-12-20',
      color: 'text-bioluminescent-teal'
    },
    {
      icon: Fish,
      title: 'Species Hunter',
      description: 'Discovered 50+ novel marine species',
      date: '2023-11-30',
      color: 'text-species-glow'
    }
  ];

  const recentActivity = [
    {
      type: 'discovery',
      title: 'Novel cephalopod species identified',
      project: 'Mariana Trench Survey',
      date: '2024-01-18',
      icon: Eye
    },
    {
      type: 'collaboration',
      title: 'Joined Arctic Deep Water project',
      project: 'Arctic Exploration Initiative',
      date: '2024-01-15',
      icon: Users
    },
    {
      type: 'analysis',
      title: 'Completed sediment sample analysis',
      project: 'Abyssal Plains Study',
      date: '2024-01-12',
      icon: BarChart3
    },
    {
      type: 'upload',
      title: 'Uploaded 15 new eDNA samples',
      project: 'Hydrothermal Vent Research',
      date: '2024-01-10',
      icon: Dna
    }
  ];

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      <div className="container mx-auto px-6 py-12 relative z-10 max-w-6xl">
        {/* Profile Header */}
        <Card className="deep-card p-8 mb-8 border border-border/20">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-bioluminescent flex items-center justify-center shadow-bioluminescent overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-foreground" />
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
              <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full" onClick={handleAvatarClick}>
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="bg-transparent border border-border/40 rounded px-2 py-1 text-foreground"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName();
                        if (e.key === 'Escape') cancelEditName();
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={saveName} className="h-7 px-3">Save</Button>
                    <Button size="sm" variant="outline" onClick={cancelEditName} className="h-7 px-3">Cancel</Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-montserrat font-bold text-foreground">
                      {user?.name || 'User'}
                    </h1>
                    <Button size="sm" variant="ghost" onClick={startEditName}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-3">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'} 
                {user?.institution && ` at ${user.institution}`}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {user?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email || 'No email provided'}
                </div>
                {user?.institution && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {user.institution}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent mb-2"
                onClick={() => setShowEditProfile(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <div className="text-sm text-muted-foreground mb-2">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
              </div>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>

        </Card>

        {/* Success Notification */}
        {showUpdateSuccess && (
          <Card className="mb-6 p-4 border border-primary/20 bg-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-primary">Profile Updated Successfully!</h4>
                <p className="text-sm text-muted-foreground">Your changes have been saved and are now visible on your profile.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Bio & Research Interests */}
              <Card className="deep-card p-6 lg:col-span-2 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                  About & Research Interests
                </h3>
                {user?.bio ? (
                  <p className="text-muted-foreground mb-4 break-words break-all whitespace-pre-wrap">
                    {user.bio}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground mb-4">
                      No bio provided yet. Click "Edit Profile" to add information about yourself and your research interests.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowEditProfile(true)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Add Bio
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Deep Sea Biology', 'eDNA Analysis', 'AI/ML Applications', 'Climate Change', 'Conservation'].map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                {/* Add Discoveries Button */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEditProfile(true)}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Add Discoveries
                  </Button>
                </div>
              </Card>

              {/* Professional Information */}
              <Card className="deep-card p-6 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                  Professional Information
                </h3>
                <div className="space-y-4">
                  {user?.publications && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Publications</h4>
                        <p className="text-xs text-muted-foreground">{user.publications}</p>
                      </div>
                    </div>
                  )}
                  
                  {user?.citations && (
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-bioluminescent-teal" />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Citations</h4>
                        <p className="text-xs text-muted-foreground">{user.citations}</p>
                      </div>
                    </div>
                  )}
                  
                  {user?.createdProjects && (
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-coral-glow" />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Created Projects</h4>
                        <p className="text-xs text-muted-foreground">{user.createdProjects}</p>
                      </div>
                    </div>
                  )}
                  
                  {user?.countries && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Countries Worked In</h4>
                        <p className="text-xs text-muted-foreground">{user.countries}</p>
                      </div>
                    </div>
                  )}
                  
                  {!user?.publications && !user?.citations && !user?.createdProjects && !user?.countries && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        No professional information provided yet.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowEditProfile(true)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Add Professional Info
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

            </div>

          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="deep-card p-6 border border-border/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-semibold text-foreground">
                  Achievements & Milestones
                </h3>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/10 border border-border/20">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                        <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="deep-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-6 text-foreground">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/10 transition-colors border border-border/10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <activity.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.project}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {activity.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="deep-card p-6 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize which email notifications you'd like to receive. Only selected topics will send emails.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    onClick={() => setShowEmailNotifications(true)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Manage Email Preferences
                  </Button>
                </div>
              </Card>

              <Card className="deep-card p-6 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-bioluminescent-teal" />
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-bioluminescent-teal text-bioluminescent-teal hover:bg-bioluminescent-teal/10"
                    onClick={() => setShowEmailVerification(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enable Email Verification
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-muted-foreground text-muted-foreground hover:bg-muted/10"
                    onClick={() => setShowDownloadData(true)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={() => {
          setShowUpdateSuccess(true);
          setTimeout(() => setShowUpdateSuccess(false), 5000);
        }}
      />

      {/* Settings Modals */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
      />
      
      <DownloadDataModal
        isOpen={showDownloadData}
        onClose={() => setShowDownloadData(false)}
      />
      
      <EmailNotificationsModal
        isOpen={showEmailNotifications}
        onClose={() => setShowEmailNotifications(false)}
      />
    </div>
  );
};

export default Profile;