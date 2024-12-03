import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

// Import Screens
import GalleryScreen from './src/screens/GalleryScreen';
import MapScreen from './src/screens/MapScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImageDetailScreen from './src/screens/ImageDetailScreen';

// Import Database and Geolocation Services
import DatabaseService from './src/database/database';
import GeolocationService from './src/utils/geolocation';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Location Permission Context
export const LocationContext = React.createContext({
  hasLocationPermission: false,
  requestPermission: async () => false,
});

// Location Permission Provider
export const LocationPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const requestPermission = async () => {
    try {
      const foregroundStatus = await Location.requestForegroundPermissionsAsync();

      if (Platform.OS === 'android') {
        const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
        setHasLocationPermission(
          foregroundStatus.status === 'granted' &&
          backgroundStatus.status === 'granted'
        );
      } else {
        setHasLocationPermission(foregroundStatus.status === 'granted');
      }
    } catch (error) {
      console.error('Location Permission Error:', error);
      Alert.alert(
        'Location Permissions',
        'We need location access to tag your photos with their location.'
      );
    }

    return hasLocationPermission;
  };

  return (
    <LocationContext.Provider value={{ hasLocationPermission, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

        switch (route.name) {
          case 'Gallery':
            iconName = focused ? 'images' : 'images-outline';
            break;
          case 'Map':
            iconName = focused ? 'map' : 'map-outline';
            break;
          case 'Camera':
            iconName = focused ? 'camera' : 'camera-outline';
            break;
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Gallery" component={GalleryScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

// Main App Navigator
const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const imageCount = await DatabaseService.getAllImages();
        console.log(`Initialized with ${imageCount.length} images`);
      } catch (error) {
        console.error('App Initialization Error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <LocationPermissionProvider>
      {/* Add the StatusBar */}
      <StatusBar
        barStyle="dark-content" // 'light-content' for light text on dark background
        backgroundColor="white" // For Android: background color of the status bar
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name="ImageDetail"
            component={ImageDetailScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationPermissionProvider>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default App;