import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import speciesDiscoveryImage from '@/assets/species-discovery.jpg';

interface Species {
  id: number;
  name: string;
  discovered: boolean;
  x: number;
  y: number;
}

export const SpeciesDiscovery = () => {
  const [discoveredSpecies, setDiscoveredSpecies] = useState<Species[]>([]);
  const [isAutoDiscovering, setIsAutoDiscovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const potentialSpecies: Species[] = [
    { id: 1, name: "Bathyphysa conifera", discovered: false, x: 20, y: 30 },
    { id: 2, name: "Vampyroteuthis infernalis", discovered: false, x: 70, y: 20 },
    { id: 3, name: "Atolla wyvillei", discovered: false, x: 50, y: 60 },
    { id: 4, name: "Crossota sp. nov.", discovered: false, x: 85, y: 45 },
    { id: 5, name: "Benthopelagic cephalopod", discovered: false, x: 15, y: 70 },
    { id: 6, name: "Hadal xenophyophore", discovered: false, x: 80, y: 75 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAutoDiscovering) {
          setIsAutoDiscovering(true);
          startAutoDiscovery();
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isAutoDiscovering]);

  const startAutoDiscovery = () => {
    potentialSpecies.forEach((species, index) => {
      setTimeout(() => {
        setDiscoveredSpecies(prev => [...prev, { ...species, discovered: true }]);
      }, index * 1000);
    });
  };

  const discoverNextSpecies = () => {
    const undiscovered = potentialSpecies.filter(
      species => !discoveredSpecies.some(d => d.id === species.id)
    );
    
    if (undiscovered.length > 0) {
      const nextSpecies = undiscovered[0];
      setDiscoveredSpecies(prev => [...prev, { ...nextSpecies, discovered: true }]);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold bioluminescent-text mb-6">
            Species Discovery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch as our AI pipeline unveils new species from the deep sea's eDNA signatures.
            Each discovery represents a breakthrough in marine biodiversity understanding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div 
              className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-depth"
              style={{
                backgroundImage: `url(${speciesDiscoveryImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Discovery overlay points */}
              {discoveredSpecies.map((species, index) => (
                <div
                  key={species.id}
                  className="species-discovery revealed absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${species.x}%`,
                    top: `${species.y}%`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse-bioluminescent shadow-bioluminescent"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-inter text-card-foreground border border-border/20">
                        {species.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-data-flow opacity-60"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="deep-card p-6 rounded-xl">
              <h3 className="text-2xl font-montserrat font-semibold mb-4 text-primary">
                Novel Taxa Identification
              </h3>
              <p className="text-muted-foreground mb-6">
                Our unsupervised learning algorithms detect patterns in eDNA sequences that don't match 
                existing databases, revealing potentially new species in real-time.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Species Discovered:</span>
                  <span className="text-primary font-medium">{discoveredSpecies.length}/{potentialSpecies.length}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-bioluminescent h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(discoveredSpecies.length / potentialSpecies.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="deep-card p-6 rounded-xl">
              <h4 className="text-lg font-montserrat font-medium mb-3 text-accent">
                Discovery Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Processing Speed</div>
                  <div className="text-primary font-medium">1.2M sequences/hour</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Accuracy</div>
                  <div className="text-species-glow font-medium">94.7%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Novel Taxa Rate</div>
                  <div className="text-coral-glow font-medium">12.3%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="text-bioluminescent-teal font-medium">89.2%</div>
                </div>
              </div>
            </div>

            <Button
              onClick={discoverNextSpecies}
              disabled={discoveredSpecies.length >= potentialSpecies.length}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-bioluminescent"
            >
              {discoveredSpecies.length >= potentialSpecies.length 
                ? "All Species Discovered!" 
                : "Discover Next Species"
              }
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};