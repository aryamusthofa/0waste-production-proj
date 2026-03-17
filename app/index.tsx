import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (session) {
        // Jika sudah login, langsung ke Home
        router.replace('/(tabs)');
      } else {
        // Jika belum, tampilkan Welcome Page
        setIsReady(true);
      }
    }
  }, [session, loading]);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-brand-dark">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="items-center pt-20 px-8">
        {/* Logo Section */}
        <View className="w-24 h-24 bg-brand-light rounded-3xl items-center justify-center mb-6 shadow-lg rotate-3">
          <Text className="text-5xl">🌱</Text>
        </View>
        
        <Text className="text-4xl font-black text-brand-dark mb-2 text-center">0waste</Text>
        <Text className="text-gray-500 text-center text-lg px-4 leading-6">
          Selamatkan makanan enak,{"\n"}hemat uang, lindungi bumi.
        </Text>

        {/* Value Props */}
        <View className="mt-12 w-full gap-6">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
              <FontAwesome name="leaf" size={20} color="green" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 text-lg">Eco-Friendly</Text>
              <Text className="text-gray-400">Kurangi limbah makanan harian.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <FontAwesome name="tags" size={20} color="#40407a" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 text-lg">Harga Diskon</Text>
              <Text className="text-gray-400">Hemat hingga 70% setiap hari.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="p-8 w-full gap-4 mb-4">
        <TouchableOpacity 
          className="bg-brand-dark py-5 rounded-2xl items-center shadow-md"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-white font-black text-lg">MASUK AKUN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white border-2 border-gray-100 py-5 rounded-2xl items-center"
          onPress={() => router.push('/auth/register')}
        >
          <Text className="text-brand-dark font-black text-lg">BUAT AKUN BARU</Text>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-300 text-xs mt-2">v1.0.0 Production Build</Text>
      </View>
    </SafeAreaView>
  );
}
