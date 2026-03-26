import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PartnerDashboardScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    discount_price: '',
    category_id: '',
    is_halal: true,
  });

  React.useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  async function uploadImage(uri: string) {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async function handlePost() {
    if (!formData.name || !formData.original_price || !formData.discount_price) {
      Alert.alert('Eits!', 'Isi dulu nama dan harga surplusnya ya.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'; // Premium Placeholder
      if (image) finalImageUrl = await uploadImage(image);

      const { error } = await supabase
        .from('products')
        .insert([{
          seller_id: user?.id,
          name: formData.name,
          description: formData.description,
          original_price: parseFloat(formData.original_price),
          discount_price: parseFloat(formData.discount_price),
          category_id: formData.category_id,
          image_url: finalImageUrl,
          is_halal: formData.is_halal,
          status: 'available',
        }]);

      if (error) throw error;

      Alert.alert('Berhasil Turun Tangan!', 'Item surplus berhasil diposting ke Marketplace 0waste Hub.', [
        { text: 'Mantap', onPress: () => {
          setImage(null);
          setFormData({ name: '', description: '', original_price: '', discount_price: '', category_id: '', is_halal: true });
          router.replace('/');
        }}
      ]);
    } catch (err: any) {
      Alert.alert('Gagal Posting', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F4F9]">
      <ScrollView className="flex-1 px-5 pt-8" showsVerticalScrollIndicator={false}>
        
        {/* Header Dashboard */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
             <Text className="text-[26px] font-black text-gray-900 tracking-tight">Partner 0waste Hub</Text>
             <Text className="text-gray-500 font-medium text-sm mt-1">{profile?.full_name || 'Mitra Terverifikasi'}</Text>
          </View>
          <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
             <MaterialCommunityIcons name="shield-check" size={24} color="#3ec976" />
          </View>
        </View>

        {/* Quick Stats - Premium Partner Vibe */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-[#3ec976]/10 p-5 rounded-[24px] border border-[#3ec976]/20">
            <Ionicons name="fast-food" size={20} color="#3ec976" className="mb-2" />
            <Text className="text-[#3ec976] font-black text-[28px] mb-0.5 leading-none">128</Text>
            <Text className="text-gray-600 font-bold text-[11px] uppercase tracking-wider">Terselamatkan</Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm shadow-gray-200/50">
            <Ionicons name="time" size={20} color="#f59e0b" className="mb-2" />
            <Text className="text-gray-900 font-black text-[28px] mb-0.5 leading-none">7</Text>
            <Text className="text-gray-500 font-bold text-[11px] uppercase tracking-wider">Hampir Basi</Text>
          </View>
        </View>

        <Text className="text-[19px] font-black text-gray-900 tracking-tight mb-5">Upload Surplus Baru</Text>

        <View className="gap-5 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm shadow-gray-200/40 mb-12">
          
          {/* Image Picker Section */}
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className="w-full h-48 bg-[#F4F4F9] border-2 border-dashed border-gray-200 rounded-[20px] items-center justify-center overflow-hidden mb-2"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <View className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100 mb-3">
                   <Ionicons name="camera" size={28} color="#9ca3af" />
                </View>
                <Text className="text-gray-500 font-extrabold text-[15px]">Unggah Foto Produk</Text>
                <Text className="text-gray-400 font-medium text-[11px] mt-1">Disarankan: Foto asli kondisi terbaru</Text>
              </View>
            )}
          </TouchableOpacity>

          <View>
            <Text className="text-gray-900 font-extrabold mb-3 ml-1 text-[13px] uppercase tracking-wider">Kategori Makanan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat.id}
                  onPress={() => setFormData({...formData, category_id: cat.id})}
                  className={`mr-3 px-5 py-2.5 rounded-full border transition-all ${
                    formData.category_id === cat.id ? 'bg-[#3ec976] border-[#3ec976] shadow-sm shadow-[#3ec976]/30' : 'bg-[#F4F4F9] border-gray-200'
                  }`}
                >
                  <Text className={`font-bold text-[13px] ${formData.category_id === cat.id ? 'text-white' : 'text-gray-500'}`}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Nama Produk</Text>
            <TextInput
              className="bg-[#F4F4F9] border border-gray-100 rounded-[16px] px-5 py-3.5 text-gray-800 font-semibold"
              placeholder="Contoh: Roti Sourdough Sisa Pagi"
              placeholderTextColor="#9ca3af"
              value={formData.name}
              onChangeText={(v) => setFormData({...formData, name: v})}
            />
          </View>

          <View>
            <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Deskripsi Singkat</Text>
            <TextInput
              className="bg-[#F4F4F9] border border-gray-100 rounded-[16px] px-5 py-3.5 text-gray-800 font-semibold"
              placeholder="Misal: Kondisi masih sangat layak konsumsi..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={2}
              value={formData.description}
              onChangeText={(v) => setFormData({...formData, description: v})}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-gray-900 font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Harga Asli</Text>
              <TextInput
                className="bg-[#F4F4F9] border border-gray-100 rounded-[16px] px-5 py-3.5 text-gray-800 font-bold"
                placeholder="Rp 35.000"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={formData.original_price}
                onChangeText={(v) => setFormData({...formData, original_price: v})}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[#3ec976] font-extrabold mb-2 ml-1 text-[13px] uppercase tracking-wider">Harga Surplus</Text>
              <TextInput
                className="bg-[#3ec976]/10 border border-[#3ec976]/30 rounded-[16px] px-5 py-3.5 text-[#3ec976] font-black"
                placeholder="Rp 15.000"
                placeholderTextColor="#a7f3d0"
                keyboardType="numeric"
                value={formData.discount_price}
                onChangeText={(v) => setFormData({...formData, discount_price: v})}
              />
            </View>
          </View>

          <TouchableOpacity 
            className="flex-row items-center gap-3 mt-4 mb-2 bg-[#F4F4F9] p-4 rounded-[16px] border border-gray-100"
            onPress={() => setFormData({...formData, is_halal: !formData.is_halal})}
            activeOpacity={0.7}
          >
            <View className={`w-7 h-7 rounded-lg border flex-row items-center justify-center transition-all ${
              formData.is_halal ? 'bg-[#3ec976] border-[#3ec976] shadow-sm shadow-[#3ec976]/40' : 'bg-white border-gray-300'
            }`}>
              {formData.is_halal && <FontAwesome5 name="check" size={12} color="white" />}
            </View>
            <View>
               <Text className="text-gray-900 font-extrabold text-[15px]">Tersertifikasi Halal</Text>
               <Text className="text-gray-500 font-medium text-[11px] mt-0.5">Berikan rasa aman untuk pelanggan.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            className={`bg-[#3ec976] py-5 rounded-[20px] items-center mt-4 shadow-sm shadow-[#3ec976]/40 ${loading ? 'opacity-70' : ''}`}
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-[15px] tracking-wide uppercase">Terbitkan ke Marketplace</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
