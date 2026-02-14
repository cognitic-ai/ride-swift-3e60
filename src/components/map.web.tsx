import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Fix default icons for Metro bundler
L.Icon.Default.mergeOptions({
  imagePath: typeof window !== 'undefined' ? window.location.origin : '',
  iconUrl: require('leaflet/dist/images/marker-icon.png').default || require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default || require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default || require('leaflet/dist/images/marker-shadow.png'),
});

export default function Map({ onLocationChange, markers = [], region }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView([37.7749, -122.4194], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            map.setView([latitude, longitude], 15);

            // Add current location marker
            L.marker([latitude, longitude])
              .addTo(map)
              .bindPopup('Your location')
              .openPopup();

            onLocationChange?.({ latitude, longitude });
          },
          (error) => {
            console.log('Error getting location:', error);
          }
        );
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = L.marker([markerData.latitude, markerData.longitude])
          .addTo(mapInstanceRef.current!)
          .bindPopup(markerData.title);
        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  useEffect(() => {
    if (mapInstanceRef.current && region) {
      mapInstanceRef.current.setView([region.latitude, region.longitude],
        Math.round(Math.log2(360 / region.latitudeDelta)));
    }
  }, [region]);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
    </View>
  );
}