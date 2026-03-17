import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface PendingPartner {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
}

export default function AdminVerifyScreen() {
  const [partners, setPartners] = useState<PendingPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchPendingPartners() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'partner')
      .eq('is_verified', false);

    if (!error && data) {
      setPartners(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPendingPartners();
  }, []);

  async function approvePartner(partnerId: string, name: string) {
    Alert.alert(
      'Konfirmasi Verifikasi',
      `Apakah Anda yakin ingin menyetujui ${name} sebagai Partner Resmi?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Setujui', 
          style: 'default',
          onPress: async () => {
            const { error } = await supabase
              .from('profiles')
              .update({ is_verified: true })
              .eq('id', partnerId);

            if (error) {
              Alert.alert('Gagal', error.message);
            } else {
              Alert.alert('Berhasil', `${name} sekarang bisa mulai berjualan.`);
              fetchPendingPartners();
            }
          }
        }
      ]
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingPartners();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: 'Verifikasi Partner', headerBackTitle: 'Profil' }} />
      
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-orange-600 mt-4 font-bold">Memuat Calon Partner...</Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 p-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}
        >
          <View className="mb-6">
            <Text className="text-2xl font-black text-gray-800">Menunggu Persetujuan</Text>
            <Text className="text-gray-500">Daftar pengguna yang mendaftar sebagai Partner Bisnis.</Text>
          </View>

          {partners.length === 0 ? (
            <View className="items-center py-20 bg-white rounded-3xl border border-gray-100">
              <FontAwesome name="check-circle" size={60} color="#22c55e" />
              <Text className="text-gray-400 font-bold mt-4">Semua Partner sudah terverifikasi!</Text>
            </View>
          ) : (
            partners.map((item) => (
              <View key={item.id} className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Image 
                    source={{ uri: item.avatar_url }} 
                    className="w-14 h-14 rounded-full mr-4 border border-gray-100"
                  />
                  <View className="flex-1">
                    <Text className="font-black text-gray-800 text-lg" numberOfLines={1}>{item.full_name}</Text>
                    <Text className="text-orange-500 text-xs font-bold uppercase">Role: {item.role}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    onPress={() => approvePartner(item.id, item.full_name)}
                    className="flex-1 bg-orange-500 py-4 rounded-2xl items-center shadow-sm"
                  >
                    <Text className="text-white font-black">APPROVE PARTNER</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => Alert.alert('Tolak', 'Fitur tolak sedang dikembangkan.')}
                    className="w-14 bg-gray-100 py-4 rounded-2xl items-center justify-center"
                  >
                    <FontAwesome name="trash" size={18} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View className="h-20" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
