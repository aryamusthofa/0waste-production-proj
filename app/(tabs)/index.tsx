import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  discount_price: number;
  original_price: number;
  image_url: string;
  status: string;
  is_halal: boolean;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function BerandaScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function fetchData() {
    setLoading(true);
    
    // 1. Fetch Categories
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    // 2. Fetch Products
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]); // Re-fetch when category changes

  // Trigger search on submit or debounce could be added here
  const handleSearch = () => fetchData();

  return (
    <View className="flex-1 bg-white">
      {/* Header Search */}
      <View className="px-4 pt-4 pb-2 bg-white">
        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
          <FontAwesome name="search" size={16} color="#999" />
          <TextInput 
            className="flex-1 ml-2 text-gray-800 font-bold"
            placeholder="Cari nasi goreng, roti..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#40407a" />
        }
      >
        {/* Categories Scroller */}
        <View className="mt-4 mb-6">
          <Text className="text-lg font-black text-brand-dark mb-3">Mau makan apa?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity 
              onPress={() => setSelectedCategory(null)}
              className={`mr-3 px-5 py-3 rounded-xl border ${!selectedCategory ? 'bg-brand-dark border-brand-dark' : 'bg-white border-gray-200'}`}
            >
              <Text className={`font-bold ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>Semua</Text>
            </TouchableOpacity>
            
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`mr-3 px-5 py-3 rounded-xl border flex-row items-center gap-2 ${selectedCategory === cat.id ? 'bg-brand-dark border-brand-dark' : 'bg-white border-gray-200'}`}
              >
                {/* Icon mapping sederhana (bisa diperluas) */}
                <FontAwesome name={cat.icon as any || 'cutlery'} size={14} color={selectedCategory === cat.id ? '#fff' : '#666'} />
                <Text className={`font-bold ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600'}`}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <Text className="text-lg font-black text-brand-dark mb-4">Paling Baru</Text>
        
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#40407a" className="mt-10" />
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products.length === 0 ? (
              <View className="w-full py-10 items-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Text className="text-4xl mb-2">🍽️</Text>
                <Text className="text-gray-400 font-bold">Belum ada makanan di kategori ini.</Text>
              </View>
            ) : (
              products.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  className="bg-white rounded-3xl w-[48%] mb-4 shadow-sm border border-gray-100 overflow-hidden"
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <View className="relative">
                    <Image 
                      source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
                      className="h-36 w-full object-cover"
                    />
                    {item.is_halal && (
                      <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg">
                        <Text className="text-[10px] text-green-700 font-black">HALAL</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="p-3">
                    <Text className="font-bold text-gray-800 text-base leading-5 mb-1" numberOfLines={2}>
                      {item.name}
                    </Text>
                    
                    <View className="flex-row items-center gap-2 mt-2">
                      <View className="bg-red-50 px-2 py-1 rounded-md">
                        <Text className="text-xs text-red-600 font-bold">
                          {Math.round(((item.original_price - item.discount_price) / item.original_price) * 100)}% OFF
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <Text className="text-gray-400 line-through text-xs">
                        Rp {item.original_price.toLocaleString()}
                      </Text>
                      <Text className="text-brand-dark font-black text-lg">
                        Rp {item.discount_price.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
        
        {/* Footer Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
