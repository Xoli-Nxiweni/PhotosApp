import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Platform, 
  Alert ,
  Text
} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import DatabaseService from '../database/database';
import GeolocationService from '../utils/geolocation';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // Request Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission', 
          'Please enable location services for this app'
        );
        return;
      }

      // Get Current Location
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        // Fetch Images with Locations
        const fetchedImages = await DatabaseService.getAllImages();
        setImages(fetchedImages.filter(img => img.latitude && img.longitude));
      } catch (error) {
        console.error('Location Error:', error);
        setErrorMsg('Could not retrieve location');
      }
    })();
  }, []);

  // Fallback region if no location
  const defaultRegion = {
    latitude: -26.2041,  // Johannesburg coordinates
    longitude: 28.0473,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentRegion = () => {
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    return defaultRegion;
  };

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={getCurrentRegion()}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {images.map((image, index) => (
          <MapView.Marker
            key={index}
            coordinate={{
              latitude: image.latitude,
              longitude: image.longitude
            }}
            title={`Image ${image.id}`}
            description={image.description || 'No description'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default MapScreen;