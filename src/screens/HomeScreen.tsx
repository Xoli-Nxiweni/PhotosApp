import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ActivityCard from '../components/ActivityCard';
import { getImages } from '../database/database';

interface Image {
  id: number;
  path: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const HomeScreen: React.FC = ({ navigation }) => {
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    getImages(setImages);
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Today's Activity</Text>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ActivityCard item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;