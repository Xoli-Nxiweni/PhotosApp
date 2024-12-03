
import React, { useState } from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LocationMap from '../components/LocationMarker'
import PlaceholderMap from '../components/MapComponent';
import { COLORS } from '../theme/colors';
import { deleteImage } from '../utils/database';

const { width, height } = Dimensions.get('window');

// More Info Icon Component
const MoreInfoIcon = ({ onPress }) => (
  <TouchableOpacity 
    style={styles.moreInfoButton} 
    onPress={onPress}
  >
    <Svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="white"
    >
      <Path 
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" 
      />
    </Svg>
  </TouchableOpacity>
);

export default function ImageDetailScreen({ route }) {
  const { image } = route.params;
  const navigation = useNavigation();
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleDeleteImage = async () => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleted = await deleteImage(image.id);
              
              if (deleted) {
                Alert.alert(
                  'Success', 
                  'Image deleted successfully',
                  [{
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }]
                );
              } else {
                Alert.alert('Error', 'Could not delete the image');
              }
            } catch (error) {
              console.error('Error deleting image:', error);
              Alert.alert('Error', 'Failed to delete image');
            }
          },
        },
      ]
    );
  };

  const toggleDetailsVisibility = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  return (
    <View style={styles.container}>
      {/* Display the image */}
      <Image 
        source={{ uri: image.uri }} 
        style={styles.fullScreenImage}
        resizeMode="contain"
      />

      {/* Delete Button */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteImage}
      >
        <Text style={styles.deleteButtonText}>🗑️ Delete Image</Text>
      </TouchableOpacity>

      {/* More Info Icon */}
      {(image.latitude && image.longitude) && (
        <MoreInfoIcon onPress={toggleDetailsVisibility} />
      )}

      {/* Location Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsVisible}
        onRequestClose={toggleDetailsVisibility}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={toggleDetailsVisibility}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Location Details</Text>
            
            {image.latitude && image.longitude && (
              <>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>
                    Latitude: {image.latitude.toFixed(4)}
                  </Text>
                  <Text style={styles.locationText}>
                    Longitude: {image.longitude.toFixed(4)}
                  </Text>
                </View>

                <LocationMap
                  latitude={image.latitude} 
                  longitude={image.longitude} 
                  style={styles.modalMap}
                />
              </>
            )}

            <Text style={styles.timestampText}>
              Taken on: {new Date(image.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  fullScreenImage: {
    width: width,
    height: height * 0.6,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.ACCENT_RED,
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  deleteButtonText: {
    color: COLORS.TEXT_WHITE,
    fontWeight: 'bold',
  },
  moreInfoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.ACCENT_BLUE,
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: COLORS.BACKGROUND_DARK,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: COLORS.TEXT_WHITE,
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.TEXT_WHITE,
    marginBottom: 15,
  },
  locationContainer: {
    backgroundColor: COLORS.ACCENT_BLUE,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationText: {
    color: COLORS.TEXT_WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  modalMap: {
    width: width * 0.8,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  timestampText: {
    color: COLORS.TEXT_LIGHT_BLUE,
    fontSize: 14,
  },
});