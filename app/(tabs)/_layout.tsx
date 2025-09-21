import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';


import { HapticTab } from '@/components/haptic-tab';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// --- SVG Icon Components ---

// SVG Icon for the Map/Trip Tracker Tab
const MapIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
    />
  </Svg>
);

// SVG Icon for the History Tab
const HistoryIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7v2a9 9 0 0 0 9-9 9 9 0 0 0-9-9zM12 8v5l4.25 2.52.75-1.23-3.5-2.07V8z"
    />
  </Svg>
);

// SVG Icon for the Profile Tab
const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </Svg>
);
//Bookings
const BookingIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"
    />
  </Svg>
);

// SVG Icon for the Dashboard Tab
const DashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M3 17h4v4H3v-4zm0-6h4v4H3v-4zm0-6h4v4H3V5zm6 12h4v4h-4v-4zm0-6h4v4h-4v-4zm0-6h4v4h-4V5zm6 12h4v4h-4v-4zm0-6h4v4h-4v-4zm0-6h4v4h-4V5z"
    />
  </Svg>
);

// --- Tab Layout Component ---

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null, // Makes background transparent for blur effect
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Creates the floating tab bar effect on iOS
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontFamily: Fonts.rounded,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trip Tracker',
          tabBarIcon: ({ color }) => <MapIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <HistoryIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <BookingIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'dashboard',
          tabBarIcon: ({ color }) => <DashboardIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}