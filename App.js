import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import { initDatabase } from './app/utils/database';
import { COLORS } from './app/theme/colors';

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.BACKGROUND_DARK} 
      />
      <AppNavigator />
    </>
  );
}