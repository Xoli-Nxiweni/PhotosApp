// import React from 'react';
// import Svg, { Path, Circle } from 'react-native-svg';
// import { View, Text, StyleSheet } from 'react-native';
// import { COLORS } from '../theme/colors';

// export default function LocationMarker({ latitude, longitude }) {
//   return (
//     <View style={styles.container}>
//       <Svg 
//         width="200" 
//         height="200" 
//         viewBox="0 0 100 100"
//       >
//         {/* Location Pin */}
//         <Path
//           d="M50 10 
//              C30 30, 30 60, 50 80 
//              C70 60, 70 30, 50 10 Z"
//           fill={COLORS.PRIMARY_BLUE}
//           stroke={COLORS.SECONDARY_BLUE}
//           strokeWidth="2"
//         />
        
//         {/* Location Dot */}
//         <Circle 
//           cx="50" 
//           cy="50" 
//           r="10" 
//           fill={COLORS.ACCENT_BLUE} 
//         />
//       </Svg>
//       <View style={styles.coordinateContainer}>
//         <Text style={styles.coordinateText}>
//           Latitude: {latitude ? latitude.toFixed(4) : 'N/A'}
//         </Text>
//         <Text style={styles.coordinateText}>
//           Longitude: {longitude ? longitude.toFixed(4) : 'N/A'}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     backgroundColor: COLORS.BACKGROUND_DARK,
//     padding: 15,
//     borderRadius: 10
//   },
//   coordinateContainer: {
//     marginTop: 10
//   },
//   coordinateText: {
//     color: COLORS.TEXT_WHITE,
//     fontSize: 16,
//     textAlign: 'center'
//   }
// });


import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function LocationMap({ 
  latitude = 40.7128, 
  longitude = -74.0060 
}) {
  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.01,  
    longitudeDelta: 0.01
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Current Location"
          description={`Lat: ${latitude}, Lon: ${longitude}`}
        >
          
          <View style={styles.markerContainer}>
            <View style={styles.markerDot} />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    borderWidth: 3,
    borderColor: 'white'
  }
});