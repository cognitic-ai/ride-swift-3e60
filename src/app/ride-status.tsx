import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as AC from '@bacons/apple-colors';
import Map from '@/components/map';

interface Driver {
  name: string;
  rating: number;
  vehicle: string;
  licensePlate: string;
  photo: string;
  phone: string;
}

type RideStatus = 'finding' | 'accepted' | 'arriving' | 'arrived' | 'in-progress' | 'completed';

export default function RideStatusScreen() {
  const [rideStatus, setRideStatus] = useState<RideStatus>('finding');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const driver: Driver = {
    name: 'John Smith',
    rating: 4.95,
    vehicle: 'Toyota Camry - White',
    licensePlate: 'ABC 123',
    photo: 'sf:person.circle.fill',
    phone: '+1 (555) 123-4567',
  };

  // Simulate ride progress
  useEffect(() => {
    const statusFlow: RideStatus[] = ['finding', 'accepted', 'arriving', 'arrived', 'in-progress', 'completed'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusFlow.length) {
        setRideStatus(statusFlow[currentIndex]);

        // Update estimated time based on status
        switch (statusFlow[currentIndex]) {
          case 'accepted':
            setEstimatedTime(4);
            break;
          case 'arriving':
            setEstimatedTime(2);
            break;
          case 'arrived':
            setEstimatedTime(0);
            break;
          case 'in-progress':
            setEstimatedTime(15);
            break;
        }
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate driver location
  useEffect(() => {
    if (rideStatus === 'accepted' || rideStatus === 'arriving') {
      // Simulate driver moving closer
      setDriverLocation({
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
      });
    }
  }, [rideStatus, estimatedTime]);

  const getStatusMessage = () => {
    switch (rideStatus) {
      case 'finding':
        return 'Looking for a nearby driver...';
      case 'accepted':
        return `${driver.name} is heading your way`;
      case 'arriving':
        return `${driver.name} will arrive in ${estimatedTime} min`;
      case 'arrived':
        return `${driver.name} has arrived`;
      case 'in-progress':
        return `On your way to destination • ${estimatedTime} min`;
      case 'completed':
        return 'You have arrived at your destination';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (rideStatus) {
      case 'finding':
        return AC.systemOrange;
      case 'accepted':
      case 'arriving':
        return AC.systemBlue;
      case 'arrived':
        return AC.systemGreen;
      case 'in-progress':
        return AC.systemPurple;
      case 'completed':
        return AC.systemGreen;
      default:
        return AC.systemGray;
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => router.back()
        },
      ]
    );
  };

  const handleCallDriver = () => {
    Alert.alert('Call Driver', `Calling ${driver.name} at ${driver.phone}`);
  };

  const handleCompleteRide = () => {
    router.push('/');
  };

  const mapMarkers = driverLocation ? [
    {
      id: 'driver',
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      title: `${driver.name} - ${driver.vehicle}`,
    },
  ] : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      {/* Map */}
      <View style={{ flex: 1 }}>
        <Map markers={mapMarkers} />

        {/* Status Indicator */}
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            backgroundColor: AC.systemBackground,
            borderRadius: 12,
            padding: 16,
            shadowColor: AC.label,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getStatusColor(),
                marginRight: 8,
              }}
            />
            <Text style={{ color: AC.label, fontSize: 16, fontWeight: '600' }}>
              {getStatusMessage()}
            </Text>
          </View>

          {rideStatus === 'finding' && (
            <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>
              This usually takes 2-5 minutes
            </Text>
          )}
        </View>
      </View>

      {/* Bottom Panel */}
      {rideStatus !== 'finding' && rideStatus !== 'completed' && (
        <View
          style={{
            backgroundColor: AC.systemBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            shadowColor: AC.label,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          {/* Driver Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={driver.photo}
              style={{
                fontSize: 40,
                color: AC.systemGray,
                marginRight: 16,
              }}
            />

            <View style={{ flex: 1 }}>
              <Text style={{ color: AC.label, fontSize: 18, fontWeight: '600' }}>
                {driver.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                <Image source="sf:star.fill" style={{ fontSize: 14, color: AC.systemYellow, marginRight: 4 }} />
                <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>
                  {driver.rating} • {driver.vehicle}
                </Text>
              </View>
              <Text style={{ color: AC.tertiaryLabel, fontSize: 14 }}>
                {driver.licensePlate}
              </Text>
            </View>

            <Pressable
              onPress={handleCallDriver}
              style={{
                backgroundColor: AC.systemBlue,
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image source="sf:phone.fill" style={{ fontSize: 18, color: 'white' }} />
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {rideStatus !== 'in-progress' && (
              <Pressable
                onPress={handleCancelRide}
                style={{
                  flex: 1,
                  backgroundColor: AC.systemRed,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Cancel Ride</Text>
              </Pressable>
            )}

            {rideStatus === 'arrived' && (
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: AC.systemGreen,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>I'm Here</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Completion Screen */}
      {rideStatus === 'completed' && (
        <View
          style={{
            backgroundColor: AC.systemBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 20,
            shadowColor: AC.label,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image
              source="sf:checkmark.circle.fill"
              style={{ fontSize: 60, color: AC.systemGreen, marginBottom: 16 }}
            />
            <Text style={{ color: AC.label, fontSize: 24, fontWeight: '600', marginBottom: 8 }}>
              Trip Completed
            </Text>
            <Text style={{ color: AC.secondaryLabel, fontSize: 16, textAlign: 'center' }}>
              Hope you enjoyed your ride with {driver.name}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: AC.secondarySystemBackground,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: AC.label, fontSize: 16 }}>Total Fare</Text>
              <Text style={{ color: AC.label, fontSize: 16, fontWeight: '600' }}>$16.50</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>Visa •••• 1234</Text>
              <Text style={{ color: AC.systemGreen, fontSize: 14 }}>Paid</Text>
            </View>
          </View>

          <Pressable
            onPress={handleCompleteRide}
            style={{
              backgroundColor: AC.systemBlue,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Done</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}