import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number;
  discount_price: number;
  image_url: string;
  status: string;
  is_halal: boolean;
  seller_id: string;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  async function fetchProductDetail() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      Alert.alert('Error', 'Gagal memuat detail produk');
      router.back();
    } else {
      setProduct(data);
    }
    setLoading(false);
  }

  async function handleBuy(method: 'pickup' | 'delivery') {
    if (!product || !user) return;

    if (product.seller_id === user.id) {
      Alert.alert('Oops', 'Kamu tidak bisa membeli barangmu sendiri.');
      return;
    }

    setBuying(true);

    // 1. Cek lagi status terakhir (Double Check)
    const { data: freshCheck } = await supabase
      .from('products')
      .select('status')
      .eq('id', product.id)
      .single();

    if (freshCheck?.status !== 'available') {
      Alert.alert('Telat!', 'Yah, barang ini baru saja diambil orang lain.');
      setBuying(false);
      router.replace('/');
      return;
    }

    // 2. Buat Order
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: user.id,
        product_id: product.id,
        method: method,
        total_price: product.discount_price,
        status: 'pending'
      }]);

    if (orderError) {
      Alert.alert('Gagal Order', orderError.message);
      setBuying(false);
      return;
    }

    // 3. Update Status Produk jadi Sold Out
    const { error: updateError } = await supabase
      .from('products')
      .update({ status: 'sold_out' })
      .eq('id', product.id);

    if (updateError) {
      console.error('Update Status Error:', updateError);
    }

    setBuying(false);
    Alert.alert('Berhasil Diselamatkan! 🎉', 'Terima kasih telah mengurangi limbah makanan. Silakan hubungi penjual.', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#40407a" />
      </View>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Detail Makanan', headerBackTitle: 'Kembali' }} />
      
      <ScrollView className="flex-1">
        <Image 
          source={{ uri: product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
          className="w-full h-72 object-cover"
        />
        
        <View className="p-6 -mt-6 bg-white rounded-t-3xl shadow-lg h-full">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-black text-gray-800 leading-7 mb-1">{product.name}</Text>
              {product.is_halal && (
                <View className="bg-green-100 self-start px-2 py-1 rounded-md mt-1">
                  <Text className="text-xs text-green-700 font-bold">HALAL CERTIFIED</Text>
                </View>
              )}
            </View>
            <View className="items-end">
              <Text className="text-gray-400 line-through">Rp {product.original_price.toLocaleString()}</Text>
              <Text className="text-brand-dark text-2xl font-black">Rp {product.discount_price.toLocaleString()}</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 my-4" />

          <Text className="text-gray-500 font-bold mb-2">Tentang Makanan Ini</Text>
          <Text className="text-gray-700 leading-6 text-base mb-8">
            {product.description || 'Tidak ada deskripsi tambahan.'}
          </Text>

          <View className="bg-blue-50 p-4 rounded-xl mb-8 flex-row items-center gap-3">
            <FontAwesome name="info-circle" size={24} color="#40407a" />
            <Text className="text-brand-dark flex-1 text-sm">
              Dengan membeli ini, kamu menyelamatkan makanan berkualitas dari tempat sampah.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="p-4 bg-white border-t border-gray-100 shadow-lg pb-8">
        <Text className="text-center text-gray-500 text-xs mb-3 font-bold">PILIH CARA PENGAMBILAN</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity 
            className={`flex-1 bg-white border-2 border-brand-dark py-4 rounded-2xl items-center ${buying ? 'opacity-50' : ''}`}
            onPress={() => handleBuy('pickup')}
            disabled={buying}
          >
            <Text className="text-brand-dark font-black">AMBIL SENDIRI</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 bg-brand-dark py-4 rounded-2xl items-center ${buying ? 'opacity-50' : ''}`}
            onPress={() => handleBuy('delivery')}
            disabled={buying}
          >
            {buying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black">DELIVERY</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
