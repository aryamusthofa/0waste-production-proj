import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Platform } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';

export default function TabLayout() {
  const { profile } = useAuth();

  // Hanya tampilkan tab 'Jual' jika User adalah PARTNER dan sudah TERVERIFIKASI
  const isPartner = profile?.role === 'partner' && profile?.is_verified;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3ec976",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          backgroundColor: '#ffffff',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          position: 'absolute', // Membuat tab bar melayang sedikit di atas konten
        },
        headerStyle: {
          backgroundColor: "#3ec976",
          shadowColor: 'transparent',
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "800",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          headerShown: false, // Disembunyikan karena sudah ada Custom Premium Header di index.tsx
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'Partner',
          // Sembunyikan TAB ini sepenuhnya jika bukan Partner Terverifikasi
          href: isPartner ? '/two' : null,
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
