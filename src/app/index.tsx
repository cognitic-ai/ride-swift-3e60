import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as AC from '@bacons/apple-colors';
import Map from '@/components/map';

interface Location {
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
  };

  const popularDestinations = [
    { title: 'San Francisco Airport', subtitle: 'SFO' },
    { title: 'Union Square', subtitle: 'Downtown SF' },
    { title: 'Golden Gate Bridge', subtitle: 'Tourist Attraction' },
    { title: 'Pier 39', subtitle: 'Fisherman\'s Wharf' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      {/* Map View */}
      <View style={{ flex: 1 }}>
        <Map onLocationChange={handleLocationChange} />

        {/* Location Button */}
        <Pressable
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            backgroundColor: AC.systemBackground,
            borderRadius: 25,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: AC.label,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Image source="sf:location.fill" style={{ fontSize: 20, color: AC.systemBlue }} />
        </Pressable>
      </View>

      {/* Bottom Panel */}
      <SafeAreaView style={{ backgroundColor: AC.systemBackground }} edges={['bottom']}>
        <View
          style={{
            backgroundColor: AC.systemBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
            shadowColor: AC.label,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          {!showSearch ? (
            <>
              {/* Where to? Button */}
              <Pressable
                onPress={() => setShowSearch(true)}
                style={{
                  backgroundColor: AC.secondarySystemBackground,
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Image source="sf:magnifyingglass" style={{ fontSize: 20, color: AC.tertiaryLabel, marginRight: 12 }} />
                <Text style={{ color: AC.tertiaryLabel, fontSize: 16 }}>Where to?</Text>
              </Pressable>

              {/* Popular Destinations */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                {popularDestinations.map((dest, index) => (
                  <Pressable
                    key={index}
                    style={{
                      backgroundColor: AC.secondarySystemBackground,
                      borderRadius: 12,
                      padding: 12,
                      marginRight: 12,
                      minWidth: 140,
                    }}
                  >
                    <Text style={{ color: AC.label, fontSize: 14, fontWeight: '600' }}>{dest.title}</Text>
                    <Text style={{ color: AC.secondaryLabel, fontSize: 12, marginTop: 2 }}>{dest.subtitle}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              {/* Search Interface */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Pressable
                  onPress={() => setShowSearch(false)}
                  style={{ marginRight: 12 }}
                >
                  <Image source="sf:chevron.left" style={{ fontSize: 20, color: AC.label }} />
                </Pressable>
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Enter destination"
                  placeholderTextColor={AC.placeholderText}
                  style={{
                    flex: 1,
                    backgroundColor: AC.secondarySystemBackground,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: AC.label,
                  }}
                  autoFocus
                />
              </View>

              {/* Book Ride Button */}
              <Link href="/ride-booking" asChild>
                <Pressable
                  style={{
                    backgroundColor: AC.systemBlue,
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Choose Ride</Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
