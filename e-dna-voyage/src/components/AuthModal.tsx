import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building, 
  MapPin, 
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'researcher' | 'student' | 'institution' | 'admin';
  institution?: string;
  location?: string;
  bio?: string;
}

const AuthModal: React.FC = () => {
  const { login, signup, showAuthModal, setShowAuthModal } = useUser();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'researcher',
    institution: '',
    location: '',
    bio: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(loginForm.email, loginForm.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup({
        name: signupForm.name,
        email: signupForm.email,
        role: signupForm.role,
        institution: signupForm.institution || undefined,
        location: signupForm.location || undefined,
        bio: signupForm.bio || undefined
      });

      if (!success) {
        setError('Email already exists');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setError('');
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border border-border/20 shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-montserrat font-bold text-foreground">
              Welcome to Samudrayan
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-foreground">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-foreground">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-role" className="text-foreground">Role</Label>
                  <Select
                    value={signupForm.role}
                    onValueChange={(value) => setSignupForm(prev => ({ ...prev, role: value as any }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="signup-institution" className="text-foreground">Institution (Optional)</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-institution"
                      type="text"
                      placeholder="Enter your institution"
                      value={signupForm.institution}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, institution: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-location" className="text-foreground">Location (Optional)</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-location"
                      type="text"
                      placeholder="Enter your location"
                      value={signupForm.location}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-bio" className="text-foreground">Bio (Optional)</Label>
                  <Textarea
                    id="signup-bio"
                    placeholder="Tell us about yourself"
                    value={signupForm.bio}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-confirm-password" className="text-foreground">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {activeTab === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <Button
                variant="link"
                onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                {activeTab === 'login' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;
