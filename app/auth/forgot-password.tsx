import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResetPassword() {
    if (!email) return Alert.alert('Error', 'Masukkan email Anda dulu.');
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://0waste-app.vercel.app/reset-password', // Contoh URL redirect produksi nanti
    });

    if (error) {
      Alert.alert('Gagal', error.message);
    } else {
      Alert.alert(
        'Email Terkirim', 
        'Instruksi reset password telah dikirim ke email Anda. Silakan cek inbox (atau folder spam).',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Pulihkan Akun', headerShown: true, headerShadowVisible: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 px-8 pt-10"
      >
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-orange-100 rounded-3xl items-center justify-center mb-4">
            <FontAwesome name="lock" size={40} color="#f97316" />
          </View>
          <Text className="text-3xl font-black text-gray-800">Lupa Password?</Text>
          <Text className="text-gray-500 text-center mt-2 px-4">
            Jangan khawatir! Masukkan email Anda di bawah dan kami akan mengirimkan link untuk mengatur ulang password.
          </Text>
        </View>

        <View className="gap-6">
          <View>
            <Text className="text-gray-700 font-bold mb-2 ml-1">Alamat Email</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 font-bold"
              placeholder="nama@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity 
            className={`bg-brand-dark py-5 rounded-2xl items-center shadow-sm ${loading ? 'opacity-70' : ''}`}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg">KIRIM LINK PEMULIHAN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center py-4"
            onPress={() => router.back()}
          >
            <Text className="text-gray-400 font-bold">Kembali ke Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
