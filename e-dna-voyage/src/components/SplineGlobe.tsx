import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineGlobeProps {
  className?: string;
}

const SplineGlobe: React.FC<SplineGlobeProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const splineRef = useRef<any>(null);

  // Continuously hide Spline branding
  useEffect(() => {
    const hideBranding = () => {
      const splineViewer = document.querySelector('spline-viewer');
      if (splineViewer) {
        // Hide any watermark elements
        const watermarks = splineViewer.querySelectorAll('[data-spline-watermark], .spline-watermark, .spline-logo, .spline-branding');
        watermarks.forEach(watermark => {
          (watermark as HTMLElement).style.display = 'none';
          (watermark as HTMLElement).style.visibility = 'hidden';
          (watermark as HTMLElement).style.opacity = '0';
        });
        
        // Ensure canvas fills the container properly
        const canvas = splineViewer.querySelector('canvas');
        if (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.objectFit = 'contain';
          canvas.style.objectPosition = 'center';
        }
      }
    };

    // Run immediately and then every 500ms to catch any dynamically added branding
    hideBranding();
    const interval = setInterval(hideBranding, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    
    // Hide Spline branding after load
    setTimeout(() => {
      const splineViewer = document.querySelector('spline-viewer');
      if (splineViewer) {
        // Hide any watermark elements
        const watermarks = splineViewer.querySelectorAll('[data-spline-watermark], .spline-watermark');
        watermarks.forEach(watermark => {
          (watermark as HTMLElement).style.display = 'none';
        });
        
        // Ensure canvas fills the container properly
        const canvas = splineViewer.querySelector('canvas');
        if (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.objectFit = 'contain';
          canvas.style.objectPosition = 'center';
        }
      }
    }, 100);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`w-full h-full relative spline-globe-container ${className}`}>
      {isLoading && (
        <div className="spline-loading-overlay">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D Globe...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="spline-error-fallback">
          <div className="text-center">
            <div className="w-16 h-16 text-primary mx-auto mb-4 animate-glow quantum-drift">
              🌍
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">3D Ocean Globe</h4>
            <p className="text-sm text-muted-foreground">Interactive biodiversity visualization</p>
          </div>
        </div>
      )}

      <Spline
        ref={splineRef}
        scene="https://prod.spline.design/g6LfnQ9E9KMcyOYa/scene.splinecode"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '0.5rem',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default SplineGlobe;