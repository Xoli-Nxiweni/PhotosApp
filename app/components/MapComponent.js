
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import * as Location from 'expo-location';

export default function PlaceholderMap({ latitude, longitude }) {
  // State to manage location information
  const [locationDetails, setLocationDetails] = useState({
    areaName: null,
    fullAddress: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationName = async () => {
      // Only attempt to fetch if coordinates are provided
      if (latitude && longitude) {
        setLoading(true);
        setError(null);

        try {
          // Attempting to reverse geocode the coordinates
          const [location] = await Location.reverseGeocodeAsync({ latitude, longitude });

          if (location) {
            // Construct a more comprehensive location description
            const cityRegion = location.city || location.region || location.subregion;
            const displayName = cityRegion 
              ? `${cityRegion}, ${location.country}`
              : location.country || 'Unknown Location';

            // Create a full address string with available details
            const fullAddress = [
              location.streetNumber,
              location.street,
              location.postalCode,
              cityRegion,
              location.country
            ].filter(Boolean).join(', ');

            setLocationDetails({
              areaName: displayName,
              fullAddress: fullAddress
            });
          } else {
            setLocationDetails({
              areaName: 'Unknown Area',
              fullAddress: null
            });
          }
        } catch (err) {
          setError('Failed to fetch location details');
          setLocationDetails({
            areaName: 'Unknown Area',
            fullAddress: null
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLocationName();
  }, [latitude, longitude]);

  return (
    <View style={styles.mapContainer}>
      {/* Display coordinates if needed, but focus on location name */}
      {latitude && longitude && (
        <Text style={styles.coordinateText}>
          Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.TEXT_WHITE} />
      ) : error ? (
        <Text style={styles.placeholderText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.placeholderText}>
            {locationDetails.areaName || 'Fetching location...'}
          </Text>
          {locationDetails.fullAddress && (
            <Text style={styles.coordinateText}>
              {locationDetails.fullAddress}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: COLORS.ACCENT_BLUE,
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  coordinateText: {
    color: COLORS.TEXT_WHITE,
    fontSize: 16,
    marginBottom: 5,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderText: {
    color: COLORS.TEXT_WHITE,
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
