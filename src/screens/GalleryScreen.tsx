import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import DatabaseService, { Image as ImageType } from '../database/database';
import GeolocationService from '../utils/geolocation';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

const GalleryScreen: React.FC = ({ navigation }) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
    getLocation();
  }, []);

  const fetchImages = async () => {
    try {
      const allImages = await DatabaseService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Error fetching images', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getLocation = async () => {
    const location = await GeolocationService.getCurrentLocation();
    if (location) setCurrentLocation(location);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const renderImage = ({ item }: { item: ImageType }) => {
    const distanceFromCurrent = currentLocation 
      ? GeolocationService.calculateDistance(
          currentLocation, 
          { latitude: item.latitude, longitude: item.longitude }
        ).toFixed(2) 
      : 'N/A';

    return (
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => navigation.navigate('ImageDetail', { imageId: item.id })}
      >
        <Image 
          source={{ uri: item.uri }} 
          style={styles.image} 
        />
        <View style={styles.overlayText}>
          <Text style={styles.distanceText}>
            {distanceFromCurrent} km away
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id?.toString() || ''}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CameraScreen')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 16,
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  overlayText: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default GalleryScreen;