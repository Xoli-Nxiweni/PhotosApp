import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';

import { COLORS } from '../theme/colors';
import { getAllImages } from '../utils/database'; // Function to fetch images
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 3; // Number of columns in the grid

export default function GalleryScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const allImages = await getAllImages();
        setImages(allImages);
        setFilteredImages(allImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
    const unsubscribe = navigation.addListener('focus', fetchImages);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (searchQuery) {
      const results = images.filter((img) =>
        img.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(results);
    } else {
      setFilteredImages(images);
    }
  }, [searchQuery, images]);

  const handleImagePress = (image) => {
    navigation.navigate('ImageDetail', { image });
  };

  const renderImageCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleImagePress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.location || 'Unknown Location'}
      </Text>
    </TouchableOpacity>
  );

  const handleCameraPress = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.TEXT_DARK} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location"
          placeholderTextColor={COLORS.TEXT_LIGHT_GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
        )}
      </View>

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {searchQuery ? `No images for "${searchQuery}"` : 'No images available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderImageCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleCameraPress}>
        <Ionicons name="camera" size={30} color={COLORS.TEXT_WHITE} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_LIGHTER,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.TEXT_DARK,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    // backgroundColor: COLORS.CARD_BACKGROUND,
    backgroundColor: 'red',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
    shadowColor: COLORS.CARD_SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%', // Adjust width to fit 3 columns with margin
    height: (width / numColumns) - 20, // Adjust height to fit 3 columns with margin
  },
  cardTitle: {
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 14,
    color: COLORS.TEXT_DARK,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.TEXT_LIGHT_GRAY,
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.PRIMARY_BLUE,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.CARD_SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});