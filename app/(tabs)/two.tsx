import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function JualMakananScreen() {
  const { user } = useAuth();
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

  // Fetch categories on mount
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
      quality: 0.7, // Kurangi kualitas sedikit agar upload lebih cepat
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function uploadImage(uri: string) {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const formData = new FormData();
    
    // Konversi URI ke Blob/File untuk upload (Web & Native Support)
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg'
      });

    if (error) throw error;

    // Ambil URL Publik
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async function handlePost() {
    if (!formData.name || !formData.original_price || !formData.discount_price) {
      Alert.alert('Eits!', 'Isi dulu nama dan harga makanannya ya.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

      if (image) {
        finalImageUrl = await uploadImage(image);
      }

      const { error } = await supabase
        .from('products')
        .insert([
          {
            seller_id: user?.id,
            name: formData.name,
            description: formData.description,
            original_price: parseFloat(formData.original_price),
            discount_price: parseFloat(formData.discount_price),
            category_id: formData.category_id,
            image_url: finalImageUrl,
            is_halal: formData.is_halal,
            status: 'available',
          }
        ]);

      if (error) throw error;

      Alert.alert('Berhasil!', 'Makananmu sudah terbit dan siap diselamatkan.', [
        { text: 'Mantap', onPress: () => {
          setImage(null);
          setFormData({ name: '', description: '', original_price: '', discount_price: '', is_halal: true });
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
    <ScrollView className="flex-1 bg-white p-6">
      <View className="mb-6">
        <Text className="text-2xl font-black text-brand-dark">Jual Makanan Sisa</Text>
        <Text className="text-gray-500">Bantu kurangi limbah dengan menjual kelebihan stokmu.</Text>
      </View>

      <View className="gap-4">
        {/* Image Picker Section */}
        <TouchableOpacity 
          onPress={pickImage}
          className="w-full h-52 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl items-center justify-center overflow-hidden mb-2"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <View className="items-center">
              <FontAwesome name="camera" size={40} color="#ccc" />
              <Text className="text-gray-400 mt-2 font-bold">Tambah Foto Makanan</Text>
            </View>
          )}
        </TouchableOpacity>

        <View>
          <Text className="text-gray-700 font-bold mb-3 ml-1">Pilih Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-2">
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                onPress={() => setFormData({...formData, category_id: cat.id})}
                className={`mr-3 px-5 py-3 rounded-xl border ${formData.category_id === cat.id ? 'bg-brand-dark border-brand-dark' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={`font-bold ${formData.category_id === cat.id ? 'text-white' : 'text-gray-500'}`}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="text-gray-700 font-bold mb-2 ml-1">Nama Makanan</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
            placeholder="Contoh: Nasi Goreng Spesial"
            value={formData.name}
            onChangeText={(v) => setFormData({...formData, name: v})}
          />
        </View>

        <View>
          <Text className="text-gray-700 font-bold mb-2 ml-1">Deskripsi Singkat</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
            placeholder="Misal: Masih anget, sisa prasmanan jam 2 siang tadi."
            multiline
            numberOfLines={3}
            value={formData.description}
            onChangeText={(v) => setFormData({...formData, description: v})}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-gray-700 font-bold mb-2 ml-1">Harga Asli</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
              placeholder="35000"
              keyboardType="numeric"
              value={formData.original_price}
              onChangeText={(v) => setFormData({...formData, original_price: v})}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 font-bold mb-2 ml-1">Harga Diskon</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800"
              placeholder="15000"
              keyboardType="numeric"
              value={formData.discount_price}
              onChangeText={(v) => setFormData({...formData, discount_price: v})}
            />
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center gap-2 mb-4 mt-2"
          onPress={() => setFormData({...formData, is_halal: !formData.is_halal})}
        >
          <View className={`w-6 h-6 rounded border ${formData.is_halal ? 'bg-green-500 border-green-500' : 'border-gray-300'} items-center justify-center`}>
            {formData.is_halal && <FontAwesome name="check" size={12} color="white" />}
          </View>
          <Text className="text-gray-700 font-bold">Makanan Halal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`bg-brand-dark py-5 rounded-2xl items-center mb-16 ${loading ? 'opacity-70' : ''}`}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">TERBITKAN SEKARANG</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
