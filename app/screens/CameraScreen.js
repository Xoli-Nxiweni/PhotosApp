import React, { useState, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { 
  getCurrentLocation, 
  getLocationName
} from '../utils/permissions';
import { saveImage } from '../utils/database';

export default function CameraScreen({ navigation }) {
  // Use the new useCameraPermissions hook
  const [permission, requestPermission] = useCameraPermissions();
  
  // Use 'back' or 'front' instead of Camera.Constants.Type
  const [facing, setFacing] = useState('back');
  
  // Use React.useRef for camera reference
  const cameraRef = useRef(null);

  // Permission handling
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Take picture
  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  // Select from gallery
  const selectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Failed to select image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Process image (save to database)
  const processImage = async (uri) => {
    try {
      const location = await getCurrentLocation();
      console.log('Retrieved location:', location);

      let locationName = 'Unknown Location';
      if (location) {
        const { latitude, longitude } = location;
        console.log('Passing coordinates to reverse geocode:', latitude, longitude);
        locationName = await getLocationName(latitude, longitude);
        console.log('Resolved location name:', locationName);
      } else {
        console.warn('No location available, saving without location data.');
      }

      await saveImage(uri, location?.latitude || null, location?.longitude || null, locationName);
      console.log('Image processed and saved successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
        mode="picture"
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={takePicture}
          >
            <MaterialIcons 
              name="photo-camera" 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={selectFromGallery}
          >
            <MaterialIcons name="photo-library" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  actionButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  galleryButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: COLORS.SECONDARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  flipButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: COLORS.ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  message: {
    textAlign: 'center',
    padding: 20
  },
  permissionButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY_BLUE,
    padding: 10,
    borderRadius: 5
  }
});