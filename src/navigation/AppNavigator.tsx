import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Define TypeScript types for your navigators
export type RootStackParamList = {
  Main: undefined;
  CameraScreen: undefined;
  ImageDetail: { imageId?: string };
  RootStack: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Gallery: undefined;
  Camera: undefined;
  Profile: undefined;
};

export type MoreTabParamList = {
  Settings: undefined;
};

// Create Navigators with TypeScript support
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const MoreTabs = createBottomTabNavigator<MoreTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// More Tabs Navigator (Additional Screens)
const MoreTabsNavigator = () => (
  <MoreTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

        if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'red',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { 
        backgroundColor: '#fff', 
        height: 60,
        paddingBottom: 10,
        paddingTop: 10 
      },
    })}
  >
    <MoreTabs.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ title: 'Settings' }}
    />
  </MoreTabs.Navigator>
);

// Main Bottom Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Gallery':
            iconName = focused ? 'images' : 'images-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'red',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { 
        backgroundColor: '#fff', 
        height: 60,
        paddingBottom: 10,
        paddingTop: 10 
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Home' }}
    />
    <Tab.Screen 
      name="Gallery" 
      component={GalleryScreen} 
      options={{ title: 'Gallery' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Root Stack Navigator
const RootStackNavigator = () => (
  <RootStack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}
  >
    <RootStack.Screen name="Main" component={MainTabs} />
    <RootStack.Screen name="CameraScreen" component={CameraScreen} />
    <RootStack.Screen 
      name="ImageDetail" 
      component={ImageDetailScreen} 
      initialParams={{ imageId: undefined }}
    />
    <RootStack.Screen name="Profile" component={ProfileScreen} />
    <RootStack.Screen name="Settings" component={SettingsScreen} />
  </RootStack.Navigator>
);

// Main App Navigator
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="RootStack" component={RootStackNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;