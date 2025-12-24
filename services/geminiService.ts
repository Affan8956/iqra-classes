
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Iqra Class", an educational institution catering to students from Nursery to 8th Standard.
Your goal is to help parents and students with queries about:
1. Admissions and Curriculum (Nursery to 8th).
2. General academic guidance for young learners.
3. Information about the school's location and contact (Phone and Address are placeholders for now).
4. Encouraging parents to email kumtheafaan@gmail.com for direct inquiries.

Be polite, encouraging, and professional. Keep responses concise and helpful.
If you don't know an answer, suggest they contact the administration at kumtheafaan@gmail.com.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having a bit of trouble connecting right now. Please try again or contact us via email.";
    }
  }
}

export const geminiService = new GeminiService();
