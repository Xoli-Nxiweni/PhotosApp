import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { deleteImage } from '../database/database';

interface ImageDetailScreenProps {
  route: {
    params: {
      image: {
        id: number;
        path: string;
        latitude: number;
        longitude: number;
        timestamp: string;
      };
    };
  };
  navigation: any;
}

const ImageDetailScreen: React.FC<ImageDetailScreenProps> = ({ route, navigation }) => {
  const { image } = route.params;

  const handleDelete = () => {
    deleteImage(image.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image.path }} style={styles.image} />
      <Text style={styles.timestamp}>Taken on {image.timestamp}</Text>
      <MapView style={styles.map} initialRegion={{ latitude: image.latitude, longitude: image.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
        <Marker coordinate={{ latitude: image.latitude, longitude: image.longitude }} />
      </MapView>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  timestamp: {
    fontSize: 16,
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageDetailScreen;