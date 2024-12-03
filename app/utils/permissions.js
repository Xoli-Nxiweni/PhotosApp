import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';



export const requestCameraPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const requestLocationPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};




export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permissions not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    console.log('Current location:', location);

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};



//getting human readable location


export const getLocationName = async (latitude, longitude) => {
  try {
    // Validate latitude and longitude
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error(`Invalid latitude or longitude: ${latitude}, ${longitude}`);
    }

    // Call reverse geocoding
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (!place) {
      console.warn('No location found for coordinates:', latitude, longitude);
      return 'Unknown Location';
    }

    // Return location name based on availability
    return place.city || place.region || place.country || 'Unknown Location';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown Location';
  }
};


