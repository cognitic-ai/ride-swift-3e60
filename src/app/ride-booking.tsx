import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import * as AC from '@bacons/apple-colors';

interface RideType {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  capacity: number;
}

export default function RideBookingScreen() {
  const [selectedRide, setSelectedRide] = useState<string>('uberx');

  const rideTypes: RideType[] = [
    {
      id: 'uberx',
      name: 'UberX',
      description: 'Affordable rides for everyday travel',
      price: '$12-16',
      duration: '5 min away',
      icon: 'sf:car.fill',
      capacity: 4,
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'More space, newer cars',
      price: '$18-24',
      duration: '8 min away',
      icon: 'sf:car.side.fill',
      capacity: 4,
    },
    {
      id: 'xl',
      name: 'UberXL',
      description: 'Spacious rides for up to 6 people',
      price: '$24-32',
      duration: '12 min away',
      icon: 'sf:car.rear.fill',
      capacity: 6,
    },
    {
      id: 'black',
      name: 'Black',
      description: 'Premium rides in luxury cars',
      price: '$35-45',
      duration: '15 min away',
      icon: 'sf:car.side.fill',
      capacity: 4,
    },
  ];

  const handleBookRide = () => {
    // Navigate to ride status screen
    router.push('/ride-status');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: AC.separator,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Image source="sf:xmark" style={{ fontSize: 20, color: AC.label }} />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: AC.label }}>Choose a ride</Text>
      </View>

      {/* Trip Details */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: AC.systemBlue,
              marginRight: 12,
            }}
          />
          <Text style={{ color: AC.label, fontSize: 16 }}>Current location</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 1,
              backgroundColor: AC.systemRed,
              marginRight: 12,
            }}
          />
          <Text style={{ color: AC.label, fontSize: 16 }}>San Francisco Airport</Text>
        </View>
      </View>

      {/* Ride Types */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {rideTypes.map((ride) => (
          <Pressable
            key={ride.id}
            onPress={() => setSelectedRide(ride.id)}
            style={{
              marginHorizontal: 20,
              marginVertical: 6,
              backgroundColor: selectedRide === ride.id ? AC.systemBlue + '20' : AC.systemBackground,
              borderRadius: 12,
              borderWidth: selectedRide === ride.id ? 2 : 1,
              borderColor: selectedRide === ride.id ? AC.systemBlue : AC.separator,
              padding: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={ride.icon}
                style={{
                  fontSize: 24,
                  color: selectedRide === ride.id ? AC.systemBlue : AC.label,
                  marginRight: 16,
                }}
              />

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: selectedRide === ride.id ? AC.systemBlue : AC.label,
                      marginRight: 8,
                    }}
                  >
                    {ride.name}
                  </Text>
                  <Image source="sf:person.fill" style={{ fontSize: 12, color: AC.secondaryLabel, marginRight: 2 }} />
                  <Text style={{ fontSize: 12, color: AC.secondaryLabel }}>{ride.capacity}</Text>
                </View>

                <Text style={{ color: AC.secondaryLabel, fontSize: 14, marginBottom: 4 }}>
                  {ride.description}
                </Text>

                <Text style={{ color: AC.tertiaryLabel, fontSize: 12 }}>
                  {ride.duration}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: selectedRide === ride.id ? AC.systemBlue : AC.label,
                }}
              >
                {ride.price}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Payment Method */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 0.5,
          borderTopColor: AC.separator,
        }}
      >
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: AC.secondarySystemBackground,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Image source="sf:creditcard.fill" style={{ fontSize: 20, color: AC.systemBlue, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: AC.label, fontSize: 16, fontWeight: '600' }}>Visa •••• 1234</Text>
            <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>Default payment</Text>
          </View>
          <Image source="sf:chevron.right" style={{ fontSize: 16, color: AC.tertiaryLabel }} />
        </Pressable>

        {/* Book Ride Button */}
        <Pressable
          onPress={handleBookRide}
          style={{
            backgroundColor: AC.systemBlue,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Confirm {rideTypes.find(r => r.id === selectedRide)?.name}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}