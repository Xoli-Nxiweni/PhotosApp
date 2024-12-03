
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../theme/colors';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      
      const userId = email.replace(/[^a-zA-Z0-9]/g, '');
      await SecureStore.setItemAsync('user_id', userId);
      navigation.replace('Gallery');
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      
      <Image 
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={COLORS.TEXT_LIGHT_BLUE}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={COLORS.TEXT_LIGHT_BLUE}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAuthentication}
      >
        <Text style={styles.buttonText}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.toggleText}>
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : 'Need an account? Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.BACKGROUND_DARK
  },
  
  logo: {
    width: 150, 
    height: 150, 
    alignSelf: 'center',
    marginBottom: 20
  },
  title: {
    color: COLORS.TEXT_WHITE,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: COLORS.ACCENT_BLUE,
    color: COLORS.TEXT_WHITE,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10
  },
  button: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    color: COLORS.TEXT_WHITE,
    textAlign: 'center',
    fontSize: 18
  },
  toggleText: {
    color: COLORS.TEXT_LIGHT_BLUE,
    textAlign: 'center',
    marginTop: 15
  }
});