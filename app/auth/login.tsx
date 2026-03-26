import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter, Link } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    if (!email || !password) return Alert.alert('Error', 'Mohon isi email dan password Anda.');
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Gagal Masuk', 'Kredensial salah. Silakan periksa kembali email dan kata sandi Anda.');
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Masuk Ke 0waste Hub', headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 px-8 justify-center pb-12"
      >
        <View className="items-center mb-12">
          <View className="w-[72px] h-[72px] bg-[#3ec976]/10 rounded-[24px] items-center justify-center mb-5 border border-[#3ec976]/20">
            <FontAwesome5 name="leaf" size={28} color="#3ec976" />
          </View>
          <Text className="text-[28px] font-black text-gray-900 tracking-tight">Selamat Datang</Text>
          <Text className="text-gray-500 font-medium text-center mt-2 px-2 text-[15px] leading-relaxed">Masuk untuk melanjutkan aksi penyelamatan surplus makanan hari ini.</Text>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Email Akun</Text>
            <View className="flex-row items-center bg-[#F4F4F9] border border-gray-100 rounded-[20px] px-5 py-4">
              <Ionicons name="mail" size={18} color="#9ca3af" className="mr-3" />
              <TextInput
                className="flex-1 text-gray-800 font-semibold text-[15px] ml-3"
                placeholder="nama@email.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Kata Sandi</Text>
            <View className="flex-row items-center bg-[#F4F4F9] border border-gray-100 rounded-[20px] px-5 py-4 relative">
              <Ionicons name="lock-closed" size={18} color="#9ca3af" className="mr-3" />
              <TextInput
                className="flex-1 text-gray-800 font-semibold text-[15px] ml-3 pr-10"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-5 p-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity className="items-end py-1">
              <Text className="text-[#3ec976] font-bold text-[13px]">Lupa Sandi?</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity 
            className={`bg-[#3ec976] py-5 rounded-[24px] items-center mt-5 shadow-sm shadow-[#3ec976]/30 ${loading ? 'opacity-70' : ''}`}
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-[15px] tracking-wide">MASUK SISTEM</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8 items-center">
            <Text className="text-gray-500 font-medium text-[14px]">Belum memiliki akses? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-[#3ec976] font-black text-[14px]">Daftar Akun 0waste Hub</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
