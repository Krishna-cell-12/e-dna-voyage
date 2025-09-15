import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Lock, 
  Mail, 
  Download, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Bell
} from 'lucide-react';

// Change Password Modal
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' as any });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password must be at least 8 characters long', variant: 'destructive' as any });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Success', description: 'Password changed successfully' });
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Change Password
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Email Verification Modal
interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailVerificationModal({ isOpen, onClose }: EmailVerificationModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendVerification = async () => {
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email address', variant: 'destructive' as any });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Verification Sent', description: 'Check your email for verification instructions' });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-bioluminescent-teal" />
            Email Verification
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="p-3 bg-muted/10 rounded-lg border border-border/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-bioluminescent-teal mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What happens next?</p>
                <p>We'll send a verification link to your email. Click the link to verify your email address and enable secure notifications.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSendVerification} disabled={isLoading} className="flex-1">
              {isLoading ? 'Sending...' : 'Send Verification'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Download Data Modal
interface DownloadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadDataModal({ isOpen, onClose }: DownloadDataModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      
      // Create mock data
      const mockData = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Marine Biologist',
          institution: 'Ocean Research Institute',
          createdAt: '2023-01-15',
          bio: 'Passionate about deep-sea biodiversity research',
          publications: '25',
          citations: '1,250',
          createdProjects: '12',
          countries: 'USA, Japan, Norway'
        },
        projects: [
          { name: 'Mariana Trench Survey', status: 'active', samples: 45 },
          { name: 'Arctic Deep Water', status: 'completed', samples: 32 }
        ],
        analyses: [
          { fileName: 'sample_001.fastq', species: 'Bathypelagic Cephalopod', confidence: 94.2 },
          { fileName: 'sample_002.fastq', species: 'Hadal Xenophyophore', confidence: 91.8 }
        ]
      };
      
      if (selectedFormat === 'pdf') {
        // Simulate PDF download
        const blob = new Blob(['PDF content would be here'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        // Simulate JSON/CSV download
        const dataStr = selectedFormat === 'json' 
          ? JSON.stringify(mockData, null, 2)
          : 'Name,Email,Role\nJohn Doe,john@example.com,Marine Biologist';
        const blob = new Blob([dataStr], { 
          type: selectedFormat === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
      
      toast({ title: 'Download Complete', description: `Your data has been downloaded as ${selectedFormat.toUpperCase()}` });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-muted-foreground" />
            Download Your Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Select Format</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: 'pdf', label: 'PDF', icon: FileText },
                { value: 'json', label: 'JSON', icon: FileText },
                { value: 'csv', label: 'CSV', icon: FileText }
              ].map((format) => (
                <Button
                  key={format.value}
                  variant={selectedFormat === format.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFormat(format.value as any)}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <format.icon className="w-4 h-4" />
                  {format.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-muted/10 rounded-lg border border-border/20">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What's included:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Profile information</li>
                  <li>Project data</li>
                  <li>Analysis results</li>
                  <li>Publication records</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading} className="flex-1">
              {isDownloading ? 'Preparing...' : 'Download'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Email Notifications Modal
interface EmailNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailNotificationsModal({ isOpen, onClose }: EmailNotificationsModalProps) {
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    newDiscoveries: true,
    collaborationInvites: false,
    weeklyDigest: true,
    systemAlerts: false,
    researchOpportunities: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: 'Settings Saved', description: 'Your email preferences have been updated' });
      onClose();
    }, 1000);
  };

  const notificationTypes = [
    { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified when your projects are updated' },
    { key: 'newDiscoveries', label: 'New Discoveries', description: 'Learn about novel species discoveries' },
    { key: 'collaborationInvites', label: 'Collaboration Invites', description: 'Receive invitations to join research projects' },
    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of your research activity' },
    { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
    { key: 'researchOpportunities', label: 'Research Opportunities', description: 'Funding and collaboration opportunities' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Email Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted/10 rounded-lg border border-border/20">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-bioluminescent-teal mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Customize your notifications</p>
                <p>Choose which topics you'd like to receive emails about. Only selected topics will send notifications.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <div key={type.key} className="flex items-center justify-between p-3 rounded-lg border border-border/20">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">{type.label}</h4>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                <Switch
                  checked={notifications[type.key as keyof typeof notifications]}
                  onCheckedChange={() => handleToggle(type.key as keyof typeof notifications)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
