
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../theme/colors';

export default function ProtectedRoute({ children, navigation }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userId = await SecureStore.getItemAsync('user_id');
        
        if (userId) {
          setIsAuthenticated(true);
        } else {
          // Redirect to authentication screen if not logged in
          navigation.replace('Auth');
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        navigation.replace('Auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View 
        style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: COLORS.BACKGROUND_DARK 
        }}
      >
        <ActivityIndicator 
          size="large" 
          color={COLORS.PRIMARY_BLUE} 
        />
        <Text 
          style={{ 
            color: COLORS.TEXT_WHITE, 
            marginTop: 10 
          }}
        >
          Authenticating...
        </Text>
      </View>
    );
  }

  // Render children if authenticated
  return isAuthenticated ? children : null;
}