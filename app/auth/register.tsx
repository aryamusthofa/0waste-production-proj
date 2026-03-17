import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'partner'>('customer');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!fullName || !email || !password) return Alert.alert('Error', 'Semua kolom wajib diisi');
    
    setLoading(true);
    
    // 1. Buat Akun Auth
    const { data: { session, user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) {
      Alert.alert('Gagal Daftar', error.message);
      setLoading(false);
      return;
    }

    // 2. Jika sukses sign up, simpan ke tabel profiles
    // Note: Jika email confirmation aktif, user mungkin belum login secara otomatis
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            full_name: fullName, 
            role: role,
            avatar_url: `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=40407a&color=fff`
          }
        ]);

      if (profileError) {
        console.error('Profile Creation Error:', profileError.message);
        // Tetap lanjut, user bisa melengkapi profil nanti jika gagal di tahap ini
      }

      if (session) {
        Alert.alert('Sukses!', 'Akun Anda berhasil dibuat dan Anda telah masuk.', [
          { text: 'Lanjut', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('Cek Email Anda', 'Akun berhasil dibuat. Silakan verifikasi email Anda sebelum masuk.', [
          { text: 'Siap', onPress: () => router.replace('/auth/login') }
        ]);
      }
    }

    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Daftar Akun', headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="flex-1 px-8" contentContainerClassName="py-10">
          <View className="items-center mb-10">
            <Text className="text-5xl mb-2">🌱</Text>
            <Text className="text-3xl font-black text-brand-dark">Buat Akun Baru</Text>
            <Text className="text-gray-500 text-center mt-2">Gabung dalam gerakan kurangi sampah makanan.</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Nama Lengkap</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
                placeholder="Arya Musthofa"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
                placeholder="nama@email.com"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
                placeholder="Minimal 6 karakter"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-bold mb-3 ml-1">Daftar Sebagai:</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={() => setRole('customer')}
                  className={`flex-1 py-4 rounded-2xl items-center border-2 ${role === 'customer' ? 'bg-brand-dark border-brand-dark' : 'bg-white border-gray-100'}`}
                >
                  <Text className={`font-bold ${role === 'customer' ? 'text-white' : 'text-gray-500'}`}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setRole('partner')}
                  className={`flex-1 py-4 rounded-2xl items-center border-2 ${role === 'partner' ? 'bg-brand-dark border-brand-dark' : 'bg-white border-gray-100'}`}
                >
                  <Text className={`font-bold ${role === 'partner' ? 'text-white' : 'text-gray-500'}`}>Partner Bisnis</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              className={`bg-brand-dark py-4 rounded-2xl items-center mt-2 ${loading ? 'opacity-70' : ''}`}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Daftar Sekarang</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-6 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-gray-500">Sudah punya akun? <Text className="text-brand-dark font-bold">Masuk</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
