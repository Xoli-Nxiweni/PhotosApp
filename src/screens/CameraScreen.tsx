import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'expo-camera';

import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';

// Open SQLite database
const db = SQLite.openDatabaseSync('gallery.db');

type Props = {
  navigation: any; // Update this if you use a specific navigation type
};

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [cameraType, setCameraType] = useState<"front" | "back">("back");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Request camera permissions
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus === "granted");

        // Request location permissions
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === "granted");

        // Initialize SQLite table for images
        await db.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS images (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uri TEXT,
              latitude REAL,
              longitude REAL,
              timestamp TEXT
            );`
          );
        });
      } catch (error) {
        console.error("Initialization error:", error);
        Alert.alert("Error", "Failed to initialize app.");
      } finally {
        setLoading(false);
      }
    };
    console.log(`Camera ${Camera}`)

    initialize();
  }, []);

  const handleTakePicture = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert("Error", "Camera is not ready.");
        return;
      }

      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

      // Get geolocation
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Save image metadata to SQLite
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO images (uri, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);`,
          [photo.uri, latitude, longitude, new Date().toISOString()]
        );
      });

      // Preview the image
      setPreviewUri(photo.uri);
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image.");
    }
  };

  const handleSaveAndNavigate = () => {
    setPreviewUri(null);
    navigation.navigate("Gallery");
  };

  const toggleCameraType = () => {
    setCameraType((prevType) => (prevType === "back" ? "front" : "back"));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!hasCameraPermission || !hasLocationPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Camera and Location permissions are required to use this app.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => Alert.alert("Retry", "Please restart the app and grant permissions.")}>
          <Text style={styles.permissionButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {previewUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndNavigate}>
              <Text style={styles.buttonText}>Save & View Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setPreviewUri(null)}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType as any} // Explicit cast as type inference may fail
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
              <MaterialIcons name="flip-camera-ios" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
              <MaterialIcons name="camera-alt" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  cameraControls: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 10,
  },
  captureButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 40,
    padding: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: "#fff",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "80%",
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraScreen;


