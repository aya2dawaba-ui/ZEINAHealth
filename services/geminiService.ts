import { GoogleGenAI, Type, FunctionDeclaration, Tool, GenerateContentResponse, Content } from "@google/genai";
import { EXPERTS } from "../constants";
import { BookingDetails, User } from "../types";
import { StorageService } from "./storage";

const AI_SYSTEM_INSTRUCTION = `You are Zeina, a premium, warm, and highly knowledgeable women's health companion AI for the Middle East.

**Persona:** 
- Empathetic "Big Sister" (modest, respectful).
- Uses warm address like "Habibti" or "Dear".
- Professional yet deeply caring.

**Capabilities:**
1. **Health Logic:** Provide evidence-based advice for Dermatology, Nutrition, Dental, Gynecology, and Mental Health.
2. **Scheduling:** Manage expert bookings using 'book_appointment'. Always summarize and confirm before final booking.
3. **Visualizations:** If a user asks to "see" a meal, anatomical health concept, or wellness goal, use 'generate_health_image'.
4. **Member History:** Access user context to personalize advice.

**Formatting:** Use Markdown. Keep responses elegant and supportive.`;

const bookAppointmentTool: FunctionDeclaration = {
  name: 'book_appointment',
  parameters: {
    type: Type.OBJECT,
    properties: {
      expertId: { type: Type.STRING },
      date: { type: Type.STRING, description: 'YYYY-MM-DD' },
      time: { type: Type.STRING, description: 'e.g. 10:00 AM' },
    },
    required: ['expertId', 'date', 'time'],
  },
};

const generateImageTool: FunctionDeclaration = {
  name: 'generate_health_image',
  parameters: {
    type: Type.OBJECT,
    properties: { prompt: { type: Type.STRING, description: 'High-quality wellness or medical illustration prompt' } },
    required: ['prompt'],
  },
};

const tools: Tool[] = [{
  functionDeclarations: [
    bookAppointmentTool,
    generateImageTool
  ]
}];

export class ZeinaChat {
  private history: Content[] = [];
  private language: string;
  private userContext: string = "";
  private userId: string = 'user_demo';

  constructor(language: string = 'en') {
    this.language = language;
  }

  public setLanguage(language: string) {
    this.language = language;
  }

  public setUserProfile(user: User | null) {
    if (!user) {
      this.userContext = "";
      this.userId = 'user_demo';
      return;
    }
    this.userId = user.id;
    this.userContext = `\n[User Context: ${user.name}, Age: ${user.age}, Stage: ${user.lifeStage}]`;
  }

  async sendMessage(userMessage: string): Promise<{ 
    text: string; 
    bookingDetails?: BookingDetails; 
    generatedImage?: string;
  }> {
    if (!process.env.API_KEY) return { text: "Zeina is currently resting. Please check back soon." };

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';

    this.history.push({ role: 'user', parts: [{ text: userMessage }] });

    const expertsContext = EXPERTS.map(e => `${e.name} (${e.category}) - ID: ${e.id}`).join(', ');
    const fullSystemInstruction = AI_SYSTEM_INSTRUCTION + `\n[Expert Directory: ${expertsContext}]` + this.userContext;

    try {
      const chat = ai.chats.create({
        model: model,
        config: { systemInstruction: fullSystemInstruction, tools: tools },
        history: this.history.slice(0, -1),
      });

      let response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
      let returnData: any = {};

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          const args = call.args as any;
          let toolResponse: any = {};

          if (call.name === 'book_appointment') {
            const expert = EXPERTS.find(e => e.id === args.expertId);
            if (expert) {
              const booking = await StorageService.createAppointment({
                userId: this.userId, expertId: expert.id, expertName: expert.name,
                expertImage: expert.image, date: args.date, time: args.time, notes: "Booked via Zeina Assistant"
              });
              await StorageService.updateAppointmentStatus(booking.id, 'confirmed');
              returnData.bookingDetails = StorageService.getAppointmentById(booking.id);
              toolResponse = { status: "SUCCESS_CONFIRMED" };
            }
          } else if (call.name === 'generate_health_image') {
            const imgResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [{ text: `A clean, soft, professional wellness or medical illustration of: ${args.prompt}. Pastel tones, high-end design.` }] },
              config: { imageConfig: { aspectRatio: "1:1" } }
            });
            const imgPart = imgResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
            if (imgPart) {
              returnData.generatedImage = imgPart.inlineData.data;
              toolResponse = { status: "IMAGE_SENT" };
            }
          }

          response = await chat.sendMessage({
            message: [{ functionResponse: { name: call.name, response: toolResponse } }]
          });
        }
      }

      this.history = await chat.getHistory();
      return { text: response.text || "", ...returnData };
    } catch (error) {
      console.error("Zeina API Error:", error);
      return { text: "I'm having a little trouble connecting right now, Habibti. Let me try again in a moment." };
    }
  }
}