import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';

export default function TabLayout() {
  const { profile } = useAuth();

  // Hanya tampilkan tab 'Jual' jika User adalah PARTNER dan sudah TERVERIFIKASI
  const isPartner = profile?.role === 'partner' && profile?.is_verified;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#40407a",
        headerStyle: {
          backgroundColor: "#40407a",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          headerRight: () => (
            <View className="flex-row gap-4">
              <Link href="/chat" asChild>
                <Pressable className="mr-4">
                  <FontAwesome name="comments" size={24} color="#fff" />
                </Pressable>
              </Link>
              <Link href="/modal" asChild>
                <Pressable className="mr-4">
                  <FontAwesome name="info-circle" size={24} color="#fff" />
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'Jual Makanan',
          // Sembunyikan TAB ini sepenuhnya jika bukan Partner Terverifikasi
          href: isPartner ? '/two' : null,
          tabBarIcon: ({ color }) => <FontAwesome name="plus-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
