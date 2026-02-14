import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapProps {
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  markers?: Array<{ latitude: number; longitude: number; title: string; id: string }>;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function Map({ onLocationChange, markers = [], region }: MapProps) {
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [initialRegion, setInitialRegion] = useState(region);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);

      if (!initialRegion) {
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      onLocationChange?.({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  if (!initialRegion) {
    return <View style={{ flex: 1, backgroundColor: '#f0f0f0' }} />;
  }

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      initialRegion={initialRegion}
      region={region}
      showsUserLocation
      showsMyLocationButton
      followsUserLocation
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
        />
      ))}
    </MapView>
  );
}