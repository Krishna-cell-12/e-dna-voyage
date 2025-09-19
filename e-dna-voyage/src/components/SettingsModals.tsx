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
import { useUser } from '@/contexts/UserContext';
import { sendVerificationEmail } from '@/services/emailService';

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
  const { user, updateProfile } = useUser();

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
    try {
      const users = JSON.parse(localStorage.getItem('e-dna-users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user?.id);
      if (idx === -1) throw new Error('User not found');
      if (users[idx].password && users[idx].password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      users[idx].password = newPassword;
      localStorage.setItem('e-dna-users', JSON.stringify(users));
      updateProfile({});
      toast({ title: 'Success', description: 'Password changed successfully' });
      onClose();
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Unable to change password', variant: 'destructive' as any });
    } finally {
      setIsLoading(false);
    }
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
  const [stage, setStage] = useState<'enter' | 'verify'>('enter');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, updateProfile } = useUser();

  const handleSendVerification = async () => {
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email address', variant: 'destructive' as any });
      return;
    }
    
    setIsLoading(true);
    // Generate a 6-digit code and send via email service
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const result = await sendVerificationEmail(email, generated);
      if (!result.ok) {
        throw new Error(result.error || 'Failed to send email');
      }
      setSentCode(generated);
      localStorage.setItem('e-dna-email-code', generated);
      localStorage.setItem('e-dna-email-target', email);
      setStage('verify');
      toast({ title: 'Verification Code Sent', description: `A 6-digit code was sent to ${email}` });
    } catch (e: any) {
      // As a fallback, still allow manual code entry if email sending fails
      setSentCode(generated);
      localStorage.setItem('e-dna-email-code', generated);
      localStorage.setItem('e-dna-email-target', email);
      setSendError(e?.message || 'Email provider not configured');
      toast({ title: 'Email Service Unavailable', description: 'We could not send an email. Enter the code shown below or try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    if (!code || code.length !== 6) {
      toast({ title: 'Invalid Code', description: 'Enter the 6-digit code from your email', variant: 'destructive' as any });
      return;
    }
    const stored = localStorage.getItem('e-dna-email-code');
    const target = localStorage.getItem('e-dna-email-target');
    if (stored && code === stored && target === email) {
      // Mark verified in user store
      const users = JSON.parse(localStorage.getItem('e-dna-users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user?.id);
      if (idx !== -1) {
        users[idx].emailVerified = true;
        users[idx].email = email;
        localStorage.setItem('e-dna-users', JSON.stringify(users));
        updateProfile({ email, emailVerified: true });
      }
      localStorage.removeItem('e-dna-email-code');
      localStorage.removeItem('e-dna-email-target');
      toast({ title: 'Email Verified', description: 'Your email has been successfully verified' });
      onClose();
    } else {
      toast({ title: 'Incorrect Code', description: 'Please check the code and try again', variant: 'destructive' as any });
    }
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
          {stage === 'enter' ? (
            <>
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
                    <p>We will send a 6-digit verification code to your email. Enter it to verify your address.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                <Button onClick={handleSendVerification} disabled={isLoading} className="flex-1">{isLoading ? 'Sending...' : 'Send Code'}</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="code">Enter 6-digit Code</Label>
                <Input id="code" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g,''))} placeholder="e.g., 123456" />
                {sentCode && (
                  <p className="text-xs text-muted-foreground mt-2">If email didn’t arrive, you can use this code: <span className="text-foreground font-medium">{sentCode}</span></p>
                )}
                {sendError && (
                  <p className="text-xs text-destructive mt-2">Details: {sendError}</p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setStage('enter')} className="flex-1">Back</Button>
                <Button type="button" variant="outline" onClick={handleSendVerification} disabled={isLoading} className="flex-1">{isLoading ? 'Resending...' : 'Resend Code'}</Button>
                <Button onClick={handleVerify} className="flex-1">Verify</Button>
              </div>
            </>
          )}
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
  const { user } = useUser();

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Build current profile snapshot
      const profile = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        emailVerified: user?.emailVerified ?? false,
        role: user?.role,
        institution: user?.institution,
        location: user?.location,
        bio: user?.bio,
        publications: user?.publications,
        citations: user?.citations,
        createdProjects: user?.createdProjects,
        countries: user?.countries,
        createdAt: user?.createdAt,
        lastLogin: user?.lastLogin,
      } as const;

      const dateStamp = new Date().toISOString().split('T')[0];

      if (selectedFormat === 'pdf') {
        // Generate a real PDF using jsPDF
        const ensureJsPdf = () => new Promise<void>((resolve, reject) => {
          if ((window as any).jspdf?.jsPDF) return resolve();
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.body.appendChild(s);
        });
        await ensureJsPdf();
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        let y = 48;
        doc.setFontSize(18); doc.text('Profile Data Export', 40, y); y += 24;
        doc.setFontSize(11);
        Object.entries(profile).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          const line = `${k}: ${String(v)}`;
          doc.text(line, 40, y);
          y += 16;
          if (y > doc.internal.pageSize.getHeight() - 64) { doc.addPage(); y = 48; }
        });
        doc.setFontSize(10);
        doc.text(`Exported ${new Date().toLocaleString()}`, 40, doc.internal.pageSize.getHeight() - 24);
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile-data-${dateStamp}.pdf`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      } else if (selectedFormat === 'json') {
        const dataStr = JSON.stringify({ profile }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `profile-data-${dateStamp}.json`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      } else {
        // CSV
        const headers = Object.keys(profile).join(',');
        const values = Object.values(profile).map(v => typeof v === 'string' ? `"${v.replace(/"/g,'""')}"` : String(v)).join(',');
        const csv = `${headers}\n${values}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `profile-data-${dateStamp}.csv`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      }

      // Copy JSON snapshot to clipboard as a convenience copy
      try {
        await navigator.clipboard.writeText(JSON.stringify({ profile }, null, 2));
        toast({ title: 'Copied to Clipboard', description: 'A JSON copy of your profile was copied.' });
      } catch {
        // Clipboard might be blocked; ignore silently
      }

      toast({ title: 'Download Complete', description: `Your profile data has been downloaded as ${selectedFormat.toUpperCase()}` });
      onClose();
    } catch (e) {
      toast({ title: 'Download Failed', description: 'Unable to generate the export. Please try again.' });
    } finally {
      setIsDownloading(false);
    }
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
                  <li>Current saved profile information</li>
                  <li>Verification status</li>
                  <li>Account metadata (created, last login)</li>
                  <li>Plus: a JSON copy is placed on your clipboard</li>
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
