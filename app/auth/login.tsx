import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    if (!email || !password) return Alert.alert('Error', 'Isi email dan password dulu ya.');
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Gagal Masuk', 'Email atau password salah. Silakan cek kembali.');
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Masuk Ke 0waste', headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 px-8 justify-center"
      >
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-brand-light rounded-3xl items-center justify-center mb-4 shadow-sm rotate-3">
            <Text className="text-4xl">🌱</Text>
          </View>
          <Text className="text-3xl font-black text-brand-dark">Selamat Datang</Text>
          <Text className="text-gray-500 text-center mt-2 px-4">Masuk untuk mulai menyelamatkan makanan di sekitarmu.</Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="text-gray-700 font-bold mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 font-bold"
              placeholder="nama@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-gray-700 font-bold mb-2 ml-1">Password</Text>
            <View className="relative justify-center">
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 font-bold"
                placeholder="Masukkan password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                className="absolute right-5"
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity className="items-end py-1">
              <Text className="text-brand-dark font-bold">Lupa Password?</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity 
            className={`bg-brand-dark py-5 rounded-2xl items-center mt-4 shadow-sm ${loading ? 'opacity-70' : ''}`}
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg">MASUK SEKARANG</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Belum punya akun? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-brand-dark font-black">Daftar Di Sini</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
