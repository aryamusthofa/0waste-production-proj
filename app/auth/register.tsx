import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'partner'>('customer');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!fullName || !email || !password) return Alert.alert('Error', 'Seluruh kolom pendaftaran diwajibkan.');
    
    setLoading(true);
    
    const { data: { session, user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { full_name: fullName, role: role }
      }
    });

    if (error) {
      Alert.alert('Gagal Daftar', error.message);
      setLoading(false);
      return;
    }

    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
            id: user.id, 
            full_name: fullName, 
            role: role,
            avatar_url: `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=3ec976&color=fff`
        }]);

      if (session) {
        Alert.alert('Berhasil!', 'Identitas Anda telah diverifikasi oleh sistem 0waste Hub.', [
          { text: 'Masuk Beranda', onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert('Verifikasi Email', 'Kami telah mengirimkan tautan keamanan ke email Anda.', [
          { text: 'Siap', onPress: () => router.replace('/auth/login') }
        ]);
      }
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Daftar 0waste Hub', headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-8" contentContainerClassName="py-12" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-10">
            <View className="w-[64px] h-[64px] bg-[#3ec976]/10 rounded-2xl items-center justify-center mb-4 border border-[#3ec976]/20">
               <Ionicons name="person-add" size={24} color="#3ec976" />
            </View>
            <Text className="text-[28px] font-black text-gray-900 tracking-tight">Identitas Baru</Text>
            <Text className="text-gray-500 font-medium text-center mt-2 px-2">Daftar sekarang untuk ambil bagian dalam revolusi ekonomi sirkular.</Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Nama Lengkap</Text>
              <TextInput
                className="bg-[#F4F4F9] border border-gray-100 rounded-[20px] px-5 py-4 text-gray-800 font-semibold text-[15px]"
                placeholder="Misal: John Doe"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View>
              <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Email Akun</Text>
              <TextInput
                className="bg-[#F4F4F9] border border-gray-100 rounded-[20px] px-5 py-4 text-gray-800 font-semibold text-[15px]"
                placeholder="nama@email.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Kata Sandi</Text>
              <TextInput
                className="bg-[#F4F4F9] border border-gray-100 rounded-[20px] px-5 py-4 text-gray-800 font-semibold text-[15px]"
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mb-2 mt-2">
              <Text className="text-gray-900 font-extrabold mb-3 ml-1 text-[13px] uppercase tracking-wider">Otoritas Akun</Text>
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setRole('customer')}
                  className={`flex-1 py-4 rounded-[20px] items-center border-2 transition-all ${
                    role === 'customer' ? 'bg-[#3ec976]/10 border-[#3ec976]' : 'bg-[#F4F4F9] border-gray-100'
                  }`}
                >
                  <Ionicons name="basket" size={24} color={role === 'customer' ? '#3ec976' : '#9ca3af'} className="mb-2" />
                  <Text className={`font-bold text-[14px] ${role === 'customer' ? 'text-[#3ec976]' : 'text-gray-500'}`}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setRole('partner')}
                  className={`flex-1 py-4 rounded-[20px] items-center border-2 transition-all ${
                    role === 'partner' ? 'bg-[#3ec976]/10 border-[#3ec976]' : 'bg-[#F4F4F9] border-gray-100'
                  }`}
                >
                  <Ionicons name="storefront" size={24} color={role === 'partner' ? '#3ec976' : '#9ca3af'} className="mb-2" />
                  <Text className={`font-bold text-[14px] ${role === 'partner' ? 'text-[#3ec976]' : 'text-gray-500'}`}>Mitra / Resto</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              className={`bg-[#3ec976] py-5 rounded-[24px] items-center mt-4 shadow-sm shadow-[#3ec976]/30 ${loading ? 'opacity-70' : ''}`}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-black text-[15px] tracking-wide">CIPTAKAN AKUN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-6 items-center flex-row justify-center py-2"
              onPress={() => router.back()}
            >
              <Text className="text-gray-500 font-medium text-[14px]">Sudah terdaftar di sistem? </Text>
              <Text className="text-[#3ec976] font-black text-[14px]">Masuk Log</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
