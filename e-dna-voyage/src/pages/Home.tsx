import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AbyssBackground } from '@/components/AbyssBackground';
import { SpeciesDiscovery } from '@/components/SpeciesDiscovery';
import { Dna, Zap, Eye, Database, Brain, Waves, Upload, BarChart3 } from 'lucide-react';
import deepSeaHero from '@/assets/deep-sea-hero.jpg';
import aiPipelineImage from '@/assets/ai-pipeline.jpg';

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen pt-16">
      <AbyssBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          ref={heroRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${deepSeaHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-8">
            <span className="bioluminescent-text">Samudrayan</span>
          </h1>
          <p className="text-2xl md:text-3xl font-montserrat font-medium mb-6 text-foreground/90">
            Unveiling the Ocean's Hidden Biodiversity
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            AI-driven eDNA analysis pipeline for discovering novel marine species in the vast, mysterious depths of our oceans
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-bioluminescent font-montserrat px-8 py-6 text-lg">
                <Upload className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-montserrat px-8 py-6 text-lg">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-float">
            <Waves className="w-8 h-8 text-primary animate-glow" />
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
              The Deep Sea Challenge
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              The deep ocean remains one of Earth's final frontiers, with over 80% of marine species still undiscovered. 
              Traditional identification methods struggle with the vast biodiversity hidden in environmental DNA samples.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Limited Databases",
                description: "Current genetic databases contain less than 20% of marine species, creating massive identification gaps.",
                color: "text-coral-glow"
              },
              {
                icon: Zap,
                title: "Processing Time",
                description: "Traditional analysis takes months per sample, slowing critical conservation and research efforts.",
                color: "text-bioluminescent-teal"
              },
              {
                icon: Eye,
                title: "Hidden Diversity",
                description: "Microscopic and rare species remain invisible to conventional sampling and identification methods.",
                color: "text-bioluminescent-purple"
              }
            ].map((challenge, index) => (
              <Card key={index} className="deep-card p-6 border border-border/20 hover:shadow-bioluminescent transition-all duration-300">
                <challenge.icon className={`w-12 h-12 mb-4 ${challenge.color}`} />
                <h3 className="text-xl font-montserrat font-semibold mb-3 text-foreground">
                  {challenge.title}
                </h3>
                <p className="text-muted-foreground">
                  {challenge.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
              AI-Powered Discovery
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Our revolutionary pipeline combines unsupervised machine learning with advanced eDNA analysis 
              to identify novel marine species at unprecedented speed and accuracy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              {[
                {
                  icon: Dna,
                  title: "eDNA Extraction",
                  description: "Advanced filtration captures genetic material from water samples, preserving traces of all marine life.",
                  step: "01"
                },
                {
                  icon: Brain,
                  title: "Unsupervised Learning",
                  description: "AI algorithms detect patterns and anomalies in genetic sequences without prior species knowledge.",
                  step: "02"
                },
                {
                  icon: Eye,
                  title: "Novel Taxa ID",
                  description: "Machine learning identifies sequences that don't match existing databases, flagging new species.",
                  step: "03"
                },
                {
                  icon: Database,
                  title: "Knowledge Integration",
                  description: "Discoveries are validated and integrated into expanding marine biodiversity databases.",
                  step: "04"
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-montserrat font-bold text-primary bg-primary/20 px-2 py-1 rounded">
                        {step.step}
                      </span>
                      <h3 className="text-xl font-montserrat font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div 
                className="aspect-[4/3] rounded-xl overflow-hidden shadow-depth border border-border/20"
                style={{
                  backgroundImage: `url(${aiPipelineImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-montserrat font-semibold text-lg text-foreground mb-2">
                    Real-time Processing
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Our pipeline processes millions of genetic sequences simultaneously, 
                    identifying novel species patterns in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Species Discovery Section */}
      <SpeciesDiscovery />

      {/* Impact Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
              Global Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Our discoveries are revolutionizing marine conservation efforts and expanding our understanding 
              of ocean biodiversity at a critical time for our planet's health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "847",
                label: "Novel Species",
                description: "Discovered this year",
                color: "text-primary"
              },
              {
                value: "2.3M",
                label: "DNA Sequences",
                description: "Analyzed monthly",
                color: "text-bioluminescent-teal"
              },
              {
                value: "94.7%",
                label: "Accuracy Rate",
                description: "Species identification",
                color: "text-species-glow"
              },
              {
                value: "15x",
                label: "Faster Discovery",
                description: "Than traditional methods",
                color: "text-coral-glow"
              }
            ].map((stat, index) => (
              <Card key={index} className="deep-card p-6 text-center border border-border/20 hover:shadow-species transition-all duration-300">
                <div className={`text-3xl md:text-4xl font-montserrat font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-lg font-montserrat font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="deep-card p-8 max-w-4xl mx-auto border border-border/20">
              <h3 className="text-2xl font-montserrat font-semibold mb-4 text-accent">
                Conservation Through Discovery
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every new species we discover adds crucial data to conservation efforts. By understanding 
                the full extent of marine biodiversity, we can better protect these ecosystems before 
                they're lost to climate change and human impact. Our AI pipeline isn't just finding 
                new life—it's helping save it.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;