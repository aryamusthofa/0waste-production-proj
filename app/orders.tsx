import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, RefreshControl } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/context/AuthContext';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface OrderItem {
  id: string;
  created_at: string;
  total_price: number;
  method: string;
  status: string;
  product: {
    name: string;
    image_url: string;
  };
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'buying' | 'selling'>('buying');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchOrders() {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from('orders')
      .select(`
        id, created_at, total_price, method, status,
        product:products (name, image_url, seller_id)
      `);

    if (tab === 'buying') {
      query = query.eq('customer_id', user.id);
    } else {
      // Penjualan: Cari order yang produknya milik user login
      query = query.filter('product.seller_id', 'eq', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      // Filter manual untuk selling karena Supabase filter nested bisa tricky
      const formattedData = data.filter(item => item.product !== null) as any;
      setOrders(formattedData);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Riwayat Transaksi', headerBackTitle: 'Kembali' }} />
      
      {/* Tab Switcher */}
      <View className="flex-row p-4 border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => setTab('buying')}
          className={`flex-1 py-3 items-center rounded-2xl ${tab === 'buying' ? 'bg-brand-dark' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${tab === 'buying' ? 'text-white' : 'text-gray-400'}`}>Pesanan Saya</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setTab('selling')}
          className={`flex-1 py-3 items-center rounded-2xl ${tab === 'selling' ? 'bg-brand-dark' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${tab === 'selling' ? 'text-white' : 'text-gray-400'}`}>Penjualan Saya</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#40407a" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 p-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#40407a" />}
        >
          {orders.length === 0 ? (
            <View className="items-center py-20">
              <FontAwesome name="file-text-o" size={60} color="#eee" />
              <Text className="text-gray-400 font-bold mt-4">Belum ada transaksi di sini.</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} className="bg-white border border-gray-100 rounded-3xl p-4 mb-4 shadow-sm flex-row items-center">
                <Image 
                  source={{ uri: order.product.image_url }} 
                  className="w-16 h-16 rounded-2xl mr-4"
                />
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>{order.product.name}</Text>
                  <View className="flex-row items-center mt-1 gap-2">
                    <View className={`px-2 py-0.5 rounded-md ${order.status === 'pending' ? 'bg-orange-100' : 'bg-green-100'}`}>
                      <Text className={`text-[10px] font-bold ${order.status === 'pending' ? 'text-orange-600' : 'text-green-600 uppercase'}`}>
                        {order.status}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-[10px]">{new Date(order.created_at).toLocaleDateString('id-ID')}</Text>
                  </View>
                  <Text className="text-brand-dark font-black mt-1">Rp {order.total_price.toLocaleString()}</Text>
                </View>
                <View className="items-end">
                  <View className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    <Text className="text-[10px] text-gray-500 font-bold uppercase">{order.method}</Text>
                  </View>
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
