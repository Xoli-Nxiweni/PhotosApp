// import Geolocation from '@react-native-community/geolocation';

// export const getCurrentLocation = (callback: (location: { latitude: number; longitude: number }) => void) => {
//   Geolocation.getCurrentPosition(
//     (position) => callback(position.coords),
//     (error) => console.error('Error getting location: ', error),
//     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//   );
// };

// src/utils/geolocation.ts
import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

class GeolocationService {
  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  // Get current location
  async getCurrentLocation(): Promise<LocationCoords | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location', error);
      return null;
    }
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(
    coord1: LocationCoords, 
    coord2: LocationCoords
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.latitude)) * 
      Math.cos(this.deg2rad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Helper method to convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export default new GeolocationService();