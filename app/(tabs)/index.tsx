import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  discount_price: number;
  original_price: number;
  image_url: string;
  status: string;
  is_halal: boolean;
  category_id: string;
  expiry_time?: string;
  partner?: string;
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
  }, [selectedCategory]);

  const handleSearch = () => fetchData();

  // Helper function to format time left from expiry_time (Anti-Basi logic)
  const getTimeLeft = (expiryTime?: string) => {
    if (!expiryTime) return '⏳ 2h 30m'; // Premium fallback for UI testing
    const expiry = new Date(expiryTime);
    const now = new Date();
    const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours <= 0) return 'Basi / Expired';
    if (diffHours < 1) return `⏳ ${Math.floor(diffHours * 60)}m left`;
    
    const h = Math.floor(diffHours);
    const m = Math.floor((diffHours - h) * 60);
    return `⏳ ${h}h ${m}m left`;
  };

  return (
    <View className="flex-1 bg-[#F4F4F9]">
      {/* Premium Header Search - Modern Eco-Tech */}
      <View className="px-5 pt-12 pb-5 bg-white rounded-b-3xl shadow-sm z-10 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-5 mt-2">
          <View>
            <Text className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Lokasi Pengantaran</Text>
            <View className="flex-row items-center bg-gray-50 self-start px-2 py-1 rounded-md border border-gray-100">
              <Ionicons name="location" size={14} color="#3ec976" />
              <Text className="text-gray-800 font-bold ml-1 text-sm tracking-tight">Kuningan, Jakarta</Text>
              <Ionicons name="chevron-down" size={14} color="#999" className="ml-1" />
            </View>
          </View>
          <TouchableOpacity className="bg-white border border-gray-100 p-2.5 rounded-full relative shadow-sm">
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-[#F4F4F9] rounded-2xl px-5 py-3.5 border border-gray-100">
          <Ionicons name="search" size={20} color="#888" />
          <TextInput 
            className="flex-1 ml-3 text-gray-800 font-bold text-base"
            placeholder="Cari sourdough, salad surplus..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity className="bg-[#3ec976] p-2 rounded-xl ml-2 shadow-sm shadow-[#3ec976]/40">
            <Ionicons name="options" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3ec976" />
        }
      >
        {/* Categories Scroller - Pill-shaped Active States */}
        <View className="mt-6 mb-6">
          <Text className="text-[19px] font-black text-gray-800 mb-4 tracking-tight">Kategori Surplus</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <TouchableOpacity 
              onPress={() => setSelectedCategory(null)}
              className={`mr-3 px-6 py-2.5 rounded-full border items-center justify-center transition flex-row ${
                !selectedCategory 
                  ? 'bg-[#3ec976] border-[#3ec976] shadow-sm shadow-[#3ec976]/30' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`font-bold text-[15px] ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>Semua</Text>
            </TouchableOpacity>
            
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className={`mr-3 px-6 py-2.5 rounded-full border flex-row items-center gap-2 transition ${
                  selectedCategory === cat.id 
                    ? 'bg-[#3ec976] border-[#3ec976] shadow-sm shadow-[#3ec976]/30' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <FontAwesome name={cat.icon as any || 'cutlery'} size={14} color={selectedCategory === cat.id ? '#fff' : '#666'} />
                <Text className={`font-bold text-[15px] ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600'}`}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid - Premium Anti-Basi Style */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Text className="text-[19px] font-black text-gray-800 tracking-tight">Terdekat & Anti-Basi</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-[#3ec976] font-extrabold text-sm mr-1">Peta</Text>
            <Ionicons name="map-outline" size={16} color="#3ec976" />
          </TouchableOpacity>
        </View>
        
        {loading && !refreshing ? (
          <View className="mt-10 items-center justify-center">
             <ActivityIndicator size="large" color="#3ec976" />
             <Text className="text-gray-400 font-medium mt-3 text-sm">Menyinkronkan item surplus...</Text>
          </View>
        ) : (
          <View className="flex-col pb-10">
            {products.length === 0 ? (
              <View className="w-full py-16 items-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-2">
                <Ionicons name="leaf-outline" size={54} color="#e2e8f0" className="mb-4" />
                <Text className="text-gray-500 font-bold text-lg">Belum ada makanan surplus.</Text>
                <Text className="text-gray-400 text-sm mt-1 text-center px-8 leading-5">Restoran terdekat belum memposting surplus saat ini. Cek lagi nanti!</Text>
              </View>
            ) : (
              products.map((item) => {
                const discountPercent = Math.round(((item.original_price - item.discount_price) / item.original_price) * 100);
                const isVerySoon = getTimeLeft(item.expiry_time).includes('m left'); // Sub 1-hour styling logic
                
                return (
                  <TouchableOpacity 
                    key={item.id}
                    className="bg-white rounded-[24px] w-full mb-4 shadow-sm shadow-gray-200/50 border border-gray-50 overflow-hidden flex-row p-3 items-center"
                    onPress={() => router.push(`/product/${item.id}`)}
                    activeOpacity={0.7}
                  >
                    {/* Food Image & Discount Badge */}
                    <View className="relative">
                      <Image 
                        source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
                        className="h-28 w-28 rounded-[18px] object-cover bg-gray-100"
                      />
                      <View className="absolute top-2 left-2 bg-[#3ec976] px-2 py-1 rounded-md shadow-sm">
                        <Text className="text-[11px] text-white font-black tracking-wide">{discountPercent}% OFF</Text>
                      </View>
                    </View>
                    
                    {/* Food Details & Anti-Basi System */}
                    <View className="flex-1 ml-4 justify-center">
                      
                      {/* Top Badges (Expiry & Halal) */}
                      <View className="flex-row items-center mb-1.5 flex-wrap gap-y-1">
                        <View className={`px-2 py-0.5 rounded flex-row items-center border ${
                          isVerySoon ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                        }`}>
                           <Ionicons name="time-outline" size={10} color={isVerySoon ? "#ef4444" : "#f97316"} className="mr-1" />
                           <Text className={`text-[10px] font-extrabold ${isVerySoon ? 'text-red-600' : 'text-orange-600'}`}>
                             {getTimeLeft(item.expiry_time)}
                           </Text>
                        </View>
                        {item.is_halal && (
                          <View className="bg-emerald-50 px-1.5 py-0.5 rounded ml-2 border border-emerald-100">
                            <Text className="text-[9px] text-[#3ec976] font-black uppercase tracking-widest">Halal</Text>
                          </View>
                        )}
                      </View>

                      {/* Product Title */}
                      <Text className="font-extrabold text-gray-900 text-[16px] leading-snug mb-0.5" numberOfLines={1}>
                        {item.name}
                      </Text>
                      
                      {/* Partner Indicator */}
                      <View className="flex-row items-center mb-2.5">
                         <MaterialCommunityIcons name="shield-check" size={14} color="#3ec976" />
                         <Text className="text-[11px] text-gray-500 ml-1 font-semibold" numberOfLines={1}>
                           {item.partner || 'Mitra 0waste'}
                         </Text>
                      </View>

                      {/* Pricing & Distance */}
                      <View className="flex-row items-end justify-between mt-auto">
                        <View>
                          <Text className="text-gray-400 line-through text-[11px] font-semibold mb-0.5">
                            Rp {item.original_price.toLocaleString('id-ID')}
                          </Text>
                          <Text className="text-[#3ec976] font-black text-[18px] leading-none">
                            Rp {item.discount_price.toLocaleString('id-ID')}
                          </Text>
                        </View>
                        
                        <View className="bg-gray-50 px-2 py-1.5 rounded-lg flex-row items-center justify-center border border-gray-100 shadow-sm">
                          <Ionicons name="navigate" size={12} color="#888" />
                          {/* Random distance simulator since coordinates might not be attached to products table yet */}
                          <Text className="text-[11px] text-gray-600 font-extrabold ml-1.5">
                            {(Math.random() * 3 + 0.5).toFixed(1)} km
                          </Text>
                        </View>
                      </View>

                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
        
        {/* Generous Footer Spacing for Bottom Navigation overlap */}
        <View className="h-32" />
      </ScrollView>
    </View>
  );
}
