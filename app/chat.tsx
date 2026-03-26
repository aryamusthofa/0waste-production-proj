import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { getGeminiModel } from '../src/lib/gemini';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const SYSTEM_INSTRUCTION = `Anda adalah "Eco Assistant", asisten cerdas 0waste (0waste Hub), sebuah platform revolusioner penyelamat makanan surplus (Circular Economy). 
Tujuan Anda adalah membantu pengguna (Customer & Partner) dengan panduan Anti-Basi, tips keberlanjutan, dan info pesanan.
Identitas: Anda sangat cerdas, ramah, profesional, dan sangat peduli lingkungan.
Panduan Respons:
1. Sapa pengguna dengan hangat namun efisien.
2. Fokus edukasi pada 'food waste' dan pentingnya protokol 'Anti-Basi'.
3. Jika ditanya soal teknis/warna brand, warna kita adalah Modern Green #3ec976.
4. Gunakan gaya bahasa Indonesia yang modern, "Startup/Tech" (bisa pakai sedikit istilah Inggris jika relevan), namun tetap sopan dan jelas.
Format respons harus solid, informatif, dan langsung "to the point".`;

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([
    { role: 'model', parts: [{ text: 'Halo! Saya Eco Assistant dari 0waste Hub. Ada yang bisa saya bantu terkait sisa makanan surplus, protokol Anti-Basi, atau dampak karbon Anda hari ini?' }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (textOveride?: string) => {
    const textToSend = textOveride || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user' as const, parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = getGeminiModel(SYSTEM_INSTRUCTION);
      
      const validHistory = messages
        .slice(1)
        .map(m => ({ role: m.role, parts: m.parts }));

      const chat = model.startChat({ history: validHistory });
      const result = await chat.sendMessage(textToSend);
      const response = await result.response;
      
      const botMessage = { role: 'model' as const, parts: [{ text: response.text() }] };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Maaf, saya sedang kehilangan koneksi ke server pusat 0waste Hub. Mohon coba beberapa saat lagi.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Apa itu Anti-Basi?",
    "Cara klaim surplus?",
    "Tips simpan makanan"
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F4F4F9]">
      <Stack.Screen 
        options={{ 
          headerShown: false // Custom Header overrides default
        }} 
      />
      
      {/* Custom Premium Header */}
      <View className="pt-12 pb-4 px-5 bg-white shadow-sm flex-row items-center border-b border-gray-100 z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2.5 bg-gray-50 rounded-full border border-gray-100">
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center">
          <View className="w-10 h-10 bg-[#3ec976]/10 rounded-full items-center justify-center mr-3 border border-[#3ec976]/20">
            <FontAwesome5 name="leaf" size={16} color="#3ec976" />
          </View>
          <View>
            <Text className="text-gray-900 font-extrabold text-[17px]">Eco Assistant</Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-1.5 h-1.5 bg-[#3ec976] rounded-full mr-1" />
              <Text className="text-gray-500 font-bold text-[11px]">Online • 0waste Hub AI 2.0</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity className="p-2.5 bg-gray-50 rounded-full border border-gray-100">
          <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          className="flex-1 px-5 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View 
              key={index} 
              className={`mb-5 max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
            >
              <View 
                className={`p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#3ec976] rounded-[24px] rounded-br-[6px]'
                    : 'bg-white border border-gray-100 rounded-[24px] rounded-bl-[6px]'
                }`}
              >
                {msg.role === 'model' && index !== 0 && (
                  <View className="flex-row items-center mb-1.5 opacity-60">
                    <FontAwesome5 name="robot" size={10} color="#666" />
                    <Text className="text-[10px] font-extrabold ml-1.5 tracking-wide text-gray-500">0WASTE HUB AI</Text>
                  </View>
                )}
                <Text className={`text-[15px] leading-relaxed tracking-tight ${msg.role === 'user' ? 'text-white font-medium' : 'text-gray-800'}`}>
                  {msg.parts[0].text}
                </Text>
              </View>
            </View>
          ))}
          
          {loading && (
            <View className="self-start bg-white border border-gray-100 p-4 rounded-[24px] rounded-bl-[6px] mb-5 shadow-sm flex-row items-center">
              <ActivityIndicator size="small" color="#3ec976" className="mr-2" />
              <Text className="text-gray-400 font-bold text-xs">Mengetik analisis...</Text>
            </View>
          )}
          
          <View className="h-4" />
        </ScrollView>

        {/* Quick Prompts & Input Area */}
        <View className="bg-white border-t border-gray-100 pt-3 pb-6 px-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          
          {/* Quick Prompts Carousel */}
          {messages.length < 3 && !loading && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3.5 flex-row">
               {quickPrompts.map((prompt, idx) => (
                 <TouchableOpacity 
                   key={idx}
                   onPress={() => sendMessage(prompt)}
                   className="bg-[#F4F4F9] border border-gray-200 px-4 py-2.5 rounded-full mr-2"
                 >
                   <Text className="text-[#3ec976] font-extrabold text-[13px]">{prompt}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>
          )}

          <View className="flex-row items-end gap-3">
            <View className="flex-1 bg-[#F4F4F9] border border-gray-200 rounded-[24px] px-5 py-2.5 flex-row items-center min-h-[50px] max-h-[120px]">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Tanya soal food waste atau 0waste Hub..."
                placeholderTextColor="#9ca3af"
                className="flex-1 text-gray-800 font-semibold text-[15px] pt-2 pb-2"
                multiline
              />
            </View>
            <TouchableOpacity 
              onPress={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`w-[50px] h-[50px] rounded-[20px] items-center justify-center transition-all ${
                input.trim() && !loading ? 'bg-[#3ec976] shadow-sm shadow-[#3ec976]/40 border border-[#3ec976]' : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <Ionicons name="send" size={20} color={input.trim() && !loading ? "#fff" : "#aeaeae"} className="ml-0.5" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
