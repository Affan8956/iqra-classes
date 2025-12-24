
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Iqra Class", an educational institution catering to students from Nursery to 8th Standard.
Your goal is to help parents and students with queries about:
1. Admissions and Curriculum (Nursery to 8th).
2. General academic guidance for young learners.
3. Information about the school's contact: Phone is +91 8956578956.
4. Encouraging parents to use the contact forms or email kumtheafaan@gmail.com for direct inquiries.

You have advanced reasoning capabilities ("Thinking Mode"). Use this to break down complex academic questions or pedagogical advice for parents.
Be polite, encouraging, and professional. Keep responses helpful and clear.
If you don't know an answer, suggest they contact the administration at kumtheafaan@gmail.com.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use the process.env.API_KEY directly as specified in the guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    try {
      // Use the advanced Gemini 3 Pro model for better reasoning
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          thinkingConfig: {
            thinkingBudget: 32768,
          },
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
