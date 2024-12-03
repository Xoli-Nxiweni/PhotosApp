import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../theme/colors';

// Import the necessary screens
import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { 
            backgroundColor: COLORS.BACKGROUND_DARK 
          },
          headerTintColor: COLORS.TEXT_WHITE,
          cardStyle: { 
            backgroundColor: COLORS.BACKGROUND_DARK 
          }
        }}
      >
        {/* Gallery Screen */}
        <Stack.Screen 
          name="Gallery" 
          options={{ title: 'My Gallery' }}
          component={GalleryScreen} 
        />
        
        {/* Camera Screen */}
        <Stack.Screen 
          name="Camera" 
          options={{ title: 'Take Photo' }}
          component={CameraScreen} 
        />
        
        {/* Image Detail Screen */}
        <Stack.Screen 
          name="ImageDetail" 
          options={{ title: 'Image Details' }}
          component={ImageDetailScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



