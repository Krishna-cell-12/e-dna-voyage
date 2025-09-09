import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AbyssBackground } from '@/components/AbyssBackground';
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
  Download
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const userStats = {
    projectsCompleted: 12,
    samplesAnalyzed: 347,
    novelSpeciesFound: 89,
    collaborations: 24,
    totalSequences: 2456789,
    citationsReceived: 156
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
              <div className="w-24 h-24 rounded-full bg-gradient-bioluminescent flex items-center justify-center shadow-bioluminescent">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-montserrat font-bold text-foreground">
                  Dr. Marina Rodriguez
                </h1>
                <Button size="sm" variant="ghost">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground mb-3">
                Marine Biologist & eDNA Research Specialist
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Woods Hole, MA
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  m.rodriguez@oceaninstitute.org
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  oceanresearch.org/marina
                </div>
              </div>
            </div>

            <div className="text-right">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent mb-2">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <div className="text-sm text-muted-foreground">
                Member since Jan 2023
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{userStats.projectsCompleted}</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-bioluminescent-teal">{userStats.samplesAnalyzed}</div>
              <div className="text-xs text-muted-foreground">Samples</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-coral-glow">{userStats.novelSpeciesFound}</div>
              <div className="text-xs text-muted-foreground">Novel Species</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-species-glow">{userStats.collaborations}</div>
              <div className="text-xs text-muted-foreground">Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-bioluminescent-purple">{(userStats.totalSequences / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Sequences</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{userStats.citationsReceived}</div>
              <div className="text-xs text-muted-foreground">Citations</div>
            </div>
          </div>
        </Card>

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
                <p className="text-muted-foreground mb-4">
                  Dr. Marina Rodriguez is a leading marine biologist specializing in deep-sea biodiversity and 
                  environmental DNA analysis. With over 10 years of experience in oceanographic research, 
                  she has pioneered the use of AI-driven techniques for discovering novel marine species 
                  in extreme environments.
                </p>
                <p className="text-muted-foreground mb-4">
                  Her current research focuses on understanding the impact of climate change on deep-sea 
                  ecosystems and developing new methodologies for rapid biodiversity assessment using eDNA.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Deep Sea Biology', 'eDNA Analysis', 'AI/ML Applications', 'Climate Change', 'Conservation'].map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Recent Discoveries */}
              <Card className="deep-card p-6 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                  Recent Discoveries
                </h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-medium text-primary text-sm mb-1">
                      Bathypelagic Cephalopod
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Novel species found at 6,000m depth
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-bioluminescent-teal/10 border border-bioluminescent-teal/20">
                    <h4 className="font-medium text-bioluminescent-teal text-sm mb-1">
                      Hadal Xenophyophore
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Unique giant single-cell organism
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-coral-glow/10 border border-coral-glow/20">
                    <h4 className="font-medium text-coral-glow text-sm mb-1">
                      Deep Sea Polychaete
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Previously unknown family identified
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Research Impact */}
            <Card className="deep-card p-6 border border-border/20">
              <h3 className="font-montserrat font-semibold mb-6 text-foreground">
                Research Impact & Metrics
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Award className="w-8 h-8 text-coral-glow mx-auto mb-2" />
                  <div className="text-2xl font-bold text-coral-glow mb-1">15</div>
                  <div className="text-sm text-muted-foreground">Publications</div>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Citations</div>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-bioluminescent-teal mx-auto mb-2" />
                  <div className="text-2xl font-bold text-bioluminescent-teal mb-1">8</div>
                  <div className="text-sm text-muted-foreground">Current Projects</div>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 text-species-glow mx-auto mb-2" />
                  <div className="text-2xl font-bold text-species-glow mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="deep-card p-6 border border-border/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-semibold text-foreground">
                  Achievements & Milestones
                </h3>
                <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export CV
                </Button>
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
                <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Email Notifications
                    </label>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-muted-foreground">Project updates</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-muted-foreground">New discoveries</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-muted-foreground">Collaboration invites</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="deep-card p-6 border border-border/20">
                <h3 className="font-montserrat font-semibold mb-4 text-foreground">
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-bioluminescent-teal text-bioluminescent-teal hover:bg-bioluminescent-teal/10">
                    Enable 2FA
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-muted-foreground text-muted-foreground hover:bg-muted/10">
                    Download Data
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;