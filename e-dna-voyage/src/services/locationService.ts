export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: string;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get address from coordinates using reverse geocoding
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          resolve({
            latitude,
            longitude,
            address,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          // If reverse geocoding fails, still return coordinates
          resolve({
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          });
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    
    // Format address from the response
    const addressParts = [];
    if (data.city) addressParts.push(data.city);
    if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
    if (data.countryName) addressParts.push(data.countryName);
    
    return addressParts.join(', ') || `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
  } catch (error) {
    // Fallback to coordinates if reverse geocoding fails
    return `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
  }
};

export const formatLocation = (location: LocationData): string => {
  if (location.address) {
    return location.address;
  }
  return `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`;
};
