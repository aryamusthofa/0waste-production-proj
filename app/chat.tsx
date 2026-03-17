import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { getGeminiModel } from '../src/lib/gemini';

const SYSTEM_INSTRUCTION = `Anda adalah asisten cerdas 0waste, sebuah platform revolusioner penyelamat makanan. 
Tujuan Anda adalah membantu pengguna menemukan 'daily leftover meal' berkualitas tinggi dengan diskon hingga 70%.
Identitas: Anda ramah, modern, minimalis, dan sangat peduli lingkungan.
Panduan Respons:
1. Sapa pengguna dengan hangat. Jika Anda tahu nama mereka, gunakan itu.
2. Jelaskan bahwa makanan di 0waste adalah kelebihan stok layak makan dari hotel/restoran, BUKAN sisa piring.
3. Berikan saran makanan berdasarkan waktu (Misal: pagi sarapan roti, siang nasi box).
4. Jika ditanya soal teknis, warna brand kita adalah biru elegan #40407a.
5. Dorong pengguna untuk segera checkout sebelum makanan habis diambil orang lain.
Format respons harus singkat, padat, dan menggunakan bahasa Indonesia yang santai tapi profesional.`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([
    { role: 'model', parts: [{ text: 'Halo! Ada yang bisa saya bantu hari ini terkait makanan diskon di 0waste?' }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = getGeminiModel(SYSTEM_INSTRUCTION);
      
      // Filter history agar selalu dimulai dengan role 'user'
      // Pesan pembuka index 0 (role: model) akan dilewati
      const validHistory = messages
        .slice(1) // Lewati pesan pembuka dari model
        .map(m => ({ role: m.role, parts: m.parts }));

      const chat = model.startChat({
        history: validHistory,
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const botMessage = { role: 'model', parts: [{ text: response.text() }] };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Maaf, sepertinya ada sedikit kendala koneksi. Coba lagi ya!' }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: '0waste Assistant' }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          className="flex-1 px-4 pt-4"
        >
          {messages.map((msg, index) => (
            <View 
              key={index} 
              className={`mb-4 max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <View 
                className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark rounded-br-none' 
                    : 'bg-gray-100 rounded-bl-none'
                }`}
              >
                <Text className={`${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {msg.parts[0].text}
                </Text>
              </View>
            </View>
          ))}
          {loading && (
            <View className="self-start bg-gray-100 p-4 rounded-2xl rounded-bl-none mb-4">
              <ActivityIndicator size="small" color="#40407a" />
            </View>
          )}
        </ScrollView>

        <View className="p-4 border-t border-gray-100 flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tanya 0waste..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3"
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              input.trim() && !loading ? 'bg-brand-dark' : 'bg-gray-300'
            }`}
          >
            <Text className="text-white font-bold">↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
