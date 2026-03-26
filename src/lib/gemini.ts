import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (instruction: string) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction,
  });
};
