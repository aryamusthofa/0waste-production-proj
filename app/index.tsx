import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

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
      <View className="flex-1 justify-center items-center bg-[#F4F4F9]">
        <ActivityIndicator size="large" color="#3ec976" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff] justify-between">
      <View className="items-center pt-20 px-8">
        
        {/* Premium 0waste Hub Logo Component */}
        <View className="w-28 h-28 bg-[#3ec976]/10 rounded-[32px] items-center justify-center mb-8 shadow-sm border border-[#3ec976]/20 relative">
           <FontAwesome5 name="leaf" size={42} color="#3ec976" />
           <View className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm">
             <Ionicons name="sparkles" size={14} color="#f59e0b" />
           </View>
        </View>
        
        <Text className="text-[40px] font-black text-gray-900 mb-2 tracking-tighter text-center">0waste Hub</Text>
        <Text className="text-gray-500 text-center text-[17px] font-medium px-4 leading-[24px]">
          Selamatkan surplus makanan, hemat uang, dan lindungi bumi.
        </Text>

        {/* Value Proposition Cards - Eco-Tech Style */}
        <View className="mt-14 w-full gap-5">
          <View className="flex-row items-center gap-4 bg-[#F4F4F9] p-4 rounded-[20px] border border-gray-100">
            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-50">
              <FontAwesome5 name="globe-americas" size={18} color="#3ec976" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-gray-800 text-[16px] mb-0.5">Eco-Friendly Tech</Text>
              <Text className="text-gray-500 font-medium text-[13px] leading-tight">Kurangi emisi karbon masif dari limbah sisa makanan harian.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 bg-[#F4F4F9] p-4 rounded-[20px] border border-gray-100">
            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-50">
              <Ionicons name="shield-checkmark" size={18} color="#3ec976" />
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-gray-800 text-[16px] mb-0.5">Anti-Basi Protocol</Text>
              <Text className="text-gray-500 font-medium text-[13px] leading-tight">Makanan dijamin aman dengan sistem verifikasi waktu ketat.</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Modern High-End Action Buttons */}
      <View className="p-8 w-full gap-4 mb-2">
        <TouchableOpacity 
          className="bg-[#3ec976] py-[18px] rounded-[24px] items-center shadow-sm shadow-[#3ec976]/30"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-white font-extrabold text-[16px] tracking-wide">MASUK KE 0WASTE HUB</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white border-2 border-gray-100 py-[18px] rounded-[24px] items-center"
          onPress={() => router.push('/auth/register')}
        >
          <Text className="text-gray-800 font-extrabold text-[16px] tracking-wide">BUAT AKUN BARU</Text>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-400 text-[11px] font-bold mt-2 uppercase tracking-widest">v2.0 • Circular Economy App</Text>
      </View>
    </SafeAreaView>
  );
}
