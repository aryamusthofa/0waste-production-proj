import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { useRouter, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    if (profile) setLoading(false);
  }, [profile]);

  const handleAvatarTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    if (nextCount === 10) {
      setIsAdminMode(true);
      Alert.alert('Developer Mode', 'Admin Panel telah dibuka sementara untuk pengujian.');
    }
  };

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} />
      
      <View className="flex-1 p-6 items-center pt-10">
        {loading ? (
          <ActivityIndicator size="large" color="#40407a" />
        ) : (
          <>
            <TouchableOpacity onPress={handleAvatarTap} activeOpacity={0.8}>
              <View className="relative mb-6">
                <Image 
                  source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=40407a&color=fff` }} 
                  className="w-32 h-32 rounded-full border-4 border-gray-100"
                />
                <View className={`absolute bottom-0 right-0 px-3 py-1 rounded-full border-2 border-white ${profile?.is_verified ? 'bg-green-500' : 'bg-orange-500'}`}>
                  <Text className="text-white text-[10px] font-black uppercase">
                    {profile?.is_verified ? 'VERIFIED' : 'PENDING'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text className="text-2xl font-black text-brand-dark mb-1">{profile?.full_name || 'Pengguna 0waste'}</Text>
            <Text className="text-gray-400 mb-10">{user?.email}</Text>

            <View className="w-full gap-3">
              <Link href="/orders" asChild>
                <TouchableOpacity className="bg-gray-50 p-5 rounded-3xl flex-row justify-between items-center border border-gray-100">
                  <View className="flex-row items-center gap-3">
                    <FontAwesome name="history" size={20} color="#40407a" />
                    <Text className="font-bold text-gray-700">Riwayat Transaksi</Text>
                  </View>
                  <FontAwesome name="chevron-right" size={12} color="#ccc" />
                </TouchableOpacity>
              </Link>
              
              {/* Tombol Rahasia Admin (Muncul setelah 10x tap) */}
              {(isAdminMode || profile?.role === 'partner') && (
                <Link href="/admin/verify" asChild>
                  <TouchableOpacity className="bg-orange-50 p-5 rounded-3xl flex-row justify-between items-center border border-orange-100">
                    <View className="flex-row items-center gap-3">
                      <FontAwesome name="shield" size={20} color="#f97316" />
                      <Text className="font-bold text-orange-700">Verifikasi Partner (Internal)</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={12} color="#f97316" />
                  </TouchableOpacity>
                </Link>
              )}

              <TouchableOpacity 
                className="bg-red-50 p-5 rounded-3xl flex-row justify-center items-center mt-10"
                onPress={handleSignOut}
              >
                <Text className="font-bold text-red-600">Keluar Aplikasi</Text>
              </TouchableOpacity>
            </View>

            <Text className="absolute bottom-10 text-gray-300 text-xs text-center font-bold">
              0waste Mobile App v1.0.0{'\n'}
              PRODUCTION TEST BUILD
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
