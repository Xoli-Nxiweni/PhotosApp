import React from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = width / 3 - 6; // 3 columns with small margin

export default function ImageGridItem({ 
  image, 
  onPress, 
  gridColumns = 3 
}) {
  // Calculate dynamic grid item width based on number of columns
  const dynamicItemWidth = width / gridColumns - 6;

  return (
    <TouchableOpacity 
      style={[
        styles.gridItem, 
        { width: dynamicItemWidth, height: dynamicItemWidth }
      ]}
      onPress={() => onPress(image)}
    >
      <Image 
        source={{ uri: image.uri }} 
        style={styles.image} 
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    margin: 2,
    backgroundColor: COLORS.ACCENT_BLUE,
    overflow: 'hidden',
    borderRadius: 8
  },
  image: {
    width: '100%',
    height: '100%'
  }
});