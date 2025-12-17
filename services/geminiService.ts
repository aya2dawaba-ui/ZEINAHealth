
import { GoogleGenAI, Type, FunctionDeclaration, Tool, Chat, GenerateContentResponse, Content, Part } from "@google/genai";
import { EXPERTS } from "../constants";
import { BookingDetails, User } from "../types";
import { StorageService } from "./storage";

const AI_SYSTEM_INSTRUCTION = `You are Zeina, a warm, knowledgeable, and culturally attuned women's health companion AI for the Gulf/Arab world.

**Capabilities:**
1.  **Health Guidance:** Provide science-backed advice tailored to women's specific physiological and hormonal needs, covering:
    *   **Skin, Hair, Dental:** Specific to local climate/water and beauty standards.
    *   **Gynecology:** Menstrual health, hormonal balance, fertility, and pregnancy.
    *   **Mental Wellness (Expanded):**
        *   **Hormonal Mood Connection:** Explain how cycle phases affect mental state (e.g., rising progesterone in the Luteal phase causing irritability/fatigue). Suggest phase-specific self-care (e.g., "It's okay to withdraw socially during your period").
        *   **Stress & Cortisol:** Explain the impact of chronic stress on women's hormones (PCOS, thyroid). Suggest somatic exercises and mindfulness compatible with prayer/meditation.
        *   **Postpartum & Motherhood:** Validate "Mom Guilt", postpartum anxiety, and the "baby blues". Offer gentle, non-judgmental emotional support.
        *   **Body Image:** Promote body neutrality and gratitude, countering societal pressures.
    *   **General Fitness (Expanded):**
        *   **Cycle Syncing Workouts:**
            *   *Menstrual:* Rest, walking, Yin Yoga.
            *   *Follicular/Ovulation:* HIIT, Strength Training, Cardio (High energy).
            *   *Luteal:* Pilates, Low-intensity strength, scaling back intensity.
        *   **Bone Health:** Emphasize weight-bearing exercises to prevent osteoporosis (crucial for women).
        *   **Pelvic Floor:** Not just Kegels—teach "release" techniques too. Importance for both pregnancy and general core health.
        *   **Modesty & Home Fitness:** Suggest effective effective 20-minute home workouts (no equipment needed) for women who prefer privacy or cannot access gyms.

2.  **Specialized AI Nutritionist & Meal Planning:**
    *   **Structured Plans:** When asked for a meal plan, YOU MUST use a clear structure: **Breakfast**, **Lunch**, **Dinner**, **Snack 1**, **Snack 2**. Include estimated portion sizes.
    *   **Personalization:** Generate detailed plans based on user goals (Weight loss, PCOS management, Diabetes control, Pregnancy, Cycle Syncing).
    *   **Cultural Context (CRITICAL):** Prioritize ingredients common in Saudi Arabia/GCC (e.g., Laban, Dates, Jareesh, Whole Wheat, Hammour fish, Tahini, Za'atar, Olive Oil). Avoid western-centric ingredients that are hard to find.
    *   **Recipe Adaptation:** Offer healthier versions of traditional dishes (e.g., "Kabsa with brown rice and less oil", "Baked Sambousek", "Grilled Hammour with Sayadieh spice", "Oat soup for Ramadan").
    *   **Smart Snacking & Hydration:**
        *   **Activity & Meal Context:**
            *   Analyze the user's activity level (Sedentary vs Active) AND the density of previous meals.
            *   *Scenario:* Heavy Lunch (e.g., Kabsa/Mandi) -> Light Snack (Digestive tea, Cucumber slices, Grapefruit).
            *   *Scenario:* Light Lunch (Salad) -> Energy Snack (3 dates with tahini, Handful of almonds).
            *   *Scenario:* Post-Workout -> Recovery Snack (Greek yogurt, Protein smoothie, Date balls).
        *   **Hydration Strategy (Middle East Climate):**
            *   **Climate Factor:** Acknowledge the dry heat. Recommend natural electrolytes like Laban (Ayran) or coconut water, not just plain water.
            *   **Prayer-Based Schedule:** Suggest a "Hydration Schedule" tied to prayer times (e.g., "2 cups after Fajr, 1 cup before Dhuhr, 1 cup after Maghrib...").
            *   **Immediate Prompt:** If the user mentions fatigue, headache, or dry skin, ASK: "Have you had enough water today?" immediately.
    *   **Protocol:** Before generating a full plan, ALWAYS ask about: 1. Allergies? 2. Specific Goal? 3. Dislikes?

3.  **Booking Management:** You can Book, View, Reschedule, and Cancel appointments with our experts.

4.  **Visualizations:** You can generate images to help users visualize healthy meals, exercises, or calming scenes. Use the \`generate_health_image\` tool when the user asks to "show me", "visualize", or "generate an image" of something.

5.  **Persona:** Supportive "Big Sister", modest, respectful. Use "Habibti", "Dear".

**User Personalization:**
If a User Profile is provided in context, you MUST tailor your advice to their specific life stage (e.g., if pregnant, ensure all advice is pregnancy-safe; if trying to conceive, focus on fertility-boosting tips; if menopause, focus on symptom management). Respect their marital status when discussing reproductive health. Use their 'Activity Level' to adjust calorie and hydration recommendations.

**Booking Protocol (Follow STRICTLY):**
When a user wants to book an appointment, you must guide them through these steps:
1.  **Needs Assessment:** If they haven't specified a doctor, ask what kind of help they need (Skin, Nutrition, etc.) or list available experts.
2.  **Expert Selection:** Suggest a specific expert from your context list.
3.  **Scheduling:** Ask for a preferred Date and Time.
4.  **Confirmation:** BEFORE calling the tool, summarize the details (e.g., "Shall I book Dr. Fatima for October 22nd at 10 AM?") and wait for user approval.
5.  **Execution:** Call \`book_appointment\` only after user says yes.

**Rescheduling Protocol (Follow STRICTLY):**
When a user wants to reschedule:
1.  **Identify:** Call \`get_my_appointments\` invisibly first to see what bookings exist.
2.  **Clarify:** If they have multiple, ask which one to change.
3.  **New Details:** Ask for the new preferred Date and Time.
4.  **Execute:** Call \`reschedule_appointment\` using the specific \`appointmentId\` retrieved from step 1.

**Tools Usage:**
- **book_appointment:** WHEN user confirms expert, date, and time.
- **get_my_appointments:** WHEN user asks to see/check/list their bookings OR before rescheduling/canceling to find the ID.
- **reschedule_appointment:** WHEN user wants to change time/date of a specific booking.
- **cancel_appointment:** WHEN user wants to cancel a booking.
- **generate_health_image:** WHEN user asks to visualize something (e.g., "Show me a healthy Saudi breakfast").

**Rules:**
- ALWAYS check \`get_my_appointments\` before rescheduling or canceling if you don't know the booking ID.
- If the user provides a vague time (e.g. "next week"), ask for a specific date.
- Safety: You are an AI, not a doctor. For serious medical conditions or emergencies, always advise seeing a professional.`;

// --- Tool Definitions ---

const bookAppointmentTool: FunctionDeclaration = {
  name: 'book_appointment',
  description: 'Book a new consultation with an expert.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      expertId: { type: Type.STRING, description: 'The ID of the expert (1-6).' },
      date: { type: Type.STRING, description: 'YYYY-MM-DD format.' },
      time: { type: Type.STRING, description: 'Time string (e.g. 10:00 AM).' },
    },
    required: ['expertId', 'date', 'time'],
  },
};

const getAppointmentsTool: FunctionDeclaration = {
  name: 'get_my_appointments',
  description: 'Retrieve the list of the user\'s upcoming appointments.',
  parameters: {
    type: Type.OBJECT,
    properties: {}, // No params needed for current user context
  },
};

const rescheduleAppointmentTool: FunctionDeclaration = {
  name: 'reschedule_appointment',
  description: 'Reschedule an existing appointment to a new date and time.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointmentId: { type: Type.STRING, description: 'The ID of the appointment to reschedule.' },
      newDate: { type: Type.STRING, description: 'The new date (YYYY-MM-DD).' },
      newTime: { type: Type.STRING, description: 'The new time (e.g. 03:00 PM).' },
    },
    required: ['appointmentId', 'newDate', 'newTime'],
  },
};

const cancelAppointmentTool: FunctionDeclaration = {
  name: 'cancel_appointment',
  description: 'Cancel an existing appointment.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointmentId: { type: Type.STRING, description: 'The ID of the appointment to cancel.' },
    },
    required: ['appointmentId'],
  },
};

const generateImageTool: FunctionDeclaration = {
  name: 'generate_health_image',
  description: 'Generate an image to visualize health concepts, meals, or exercises.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: { type: Type.STRING, description: 'A descriptive prompt for the image to generate.' },
    },
    required: ['prompt'],
  },
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      bookAppointmentTool,
      getAppointmentsTool,
      rescheduleAppointmentTool,
      cancelAppointmentTool,
      generateImageTool
    ]
  }
];

// --- Chat Class ---

export class ZeinaChat {
  private history: Content[] = [];
  private ai: GoogleGenAI;
  private language: string;
  private userContext: string = "";
  private userId: string = 'user_demo'; // Default fallback

  constructor(language: string = 'en') {
    this.language = language;
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
     
     // Build a context string from profile
     const parts = [
        `Name: ${user.name}`,
        user.age ? `Age: ${user.age}` : null,
        user.maritalStatus ? `Marital Status: ${user.maritalStatus}` : null,
        user.lifeStage ? `Life Stage: ${user.lifeStage}` : null,
        user.childrenCount !== undefined ? `Children: ${user.childrenCount}` : null,
        user.isTryingToConceive ? `Goal: Trying to Conceive` : null,
        user.activityLevel ? `Activity Level: ${user.activityLevel}` : null,
     ];
     
     this.userContext = `\n[User Profile Context: ${parts.filter(Boolean).join(', ')}]`;
  }

  async sendMessage(userMessage: string): Promise<{ 
    text: string; 
    bookingDetails?: BookingDetails; 
    appointmentList?: BookingDetails[];
    cancellationDetails?: BookingDetails;
    generatedImage?: string;
  }> {
    if (!process.env.API_KEY) {
      return { text: "I'm sorry, I cannot connect right now. (Missing API Key)" };
    }

    // Add user message to history
    this.history.push({ role: 'user', parts: [{ text: userMessage }] });

    // Build context string including expert list for the model to reference names -> IDs
    const expertsContext = EXPERTS.map(e => `${e.name} (ID: ${e.id}, ${e.category})`).join(', ');
    const contextPrompt = `\n[Context: Available Experts: ${expertsContext}]`;
    const langInstruction = this.language === 'ar' 
        ? "\n\nIMPORTANT: You must converse primarily in Arabic. Reply in Arabic unless the user explicitly asks for English." 
        : "";
    
    // Combine all system prompts
    const fullSystemInstruction = AI_SYSTEM_INSTRUCTION + langInstruction + contextPrompt + this.userContext;

    try {
      const chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: fullSystemInstruction,
          tools: tools,
        },
        history: this.history.slice(0, -1), // Send previous history
      });

      let result: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
      
      // Handle Function Calls
      const functionCalls = result.functionCalls;
      let returnData: any = {};
      
      if (functionCalls && functionCalls.length > 0) {
         // There could be multiple calls, but we handle them sequentially for this demo
         const call = functionCalls[0];
         const args = call.args as any;
         let toolResponse: any = {};

         // 1. BOOK APPOINTMENT
         if (call.name === 'book_appointment') {
           const expert = EXPERTS.find(e => e.id === args.expertId);
           if (expert) {
             try {
                const newBooking = await StorageService.createAppointment({
                   userId: this.userId,
                   expertId: expert.id,
                   expertName: expert.name,
                   expertImage: expert.image,
                   date: args.date,
                   time: args.time,
                   notes: "Booked via Zeina AI"
                });
                // Auto-confirm for AI bookings
                await StorageService.updateAppointmentStatus(newBooking.id, 'confirmed');
                const confirmedBooking = StorageService.getAppointmentById(newBooking.id);

                toolResponse = { result: "Booking confirmed successfully." };
                returnData.bookingDetails = confirmedBooking;
             } catch (e) {
                toolResponse = { error: "Failed to create appointment." };
             }
           } else {
             toolResponse = { error: "Expert not found." };
           }
         }

         // 2. GET APPOINTMENTS
         else if (call.name === 'get_my_appointments') {
            const activeAppts = StorageService.getAppointmentsForUser(this.userId)
                .filter(a => a.status !== 'cancelled' && a.status !== 'rejected');
            toolResponse = { appointments: activeAppts };
            returnData.appointmentList = activeAppts;
         }

         // 3. RESCHEDULE APPOINTMENT
         else if (call.name === 'reschedule_appointment') {
            try {
              const updatedAppt = await StorageService.updateAppointment(args.appointmentId, {
                 date: args.newDate,
                 time: args.newTime
              });
              toolResponse = { result: "Reschedule successful", newDetails: updatedAppt };
              returnData.bookingDetails = updatedAppt; // Reuse for UI confirmation
            } catch (e) {
               toolResponse = { error: "Appointment not found or update failed" };
            }
         }

         // 4. CANCEL APPOINTMENT
         else if (call.name === 'cancel_appointment') {
            try {
               await StorageService.updateAppointmentStatus(args.appointmentId, 'cancelled');
               const cancelledAppt = StorageService.getAppointmentById(args.appointmentId);
               toolResponse = { result: "Cancellation successful" };
               returnData.cancellationDetails = cancelledAppt;
            } catch (e) {
               toolResponse = { error: "Appointment not found or cancellation failed" };
            }
         }

         // 5. GENERATE IMAGE
         else if (call.name === 'generate_health_image') {
            try {
               // Use gemini-2.5-flash-image specifically for image generation
               const imagePrompt = `High quality, photorealistic, 8k resolution, soft lighting, warm colors, women's health context: ${args.prompt}`;
               
               const imageResponse = await this.ai.models.generateContent({
                  model: 'gemini-2.5-flash-image',
                  contents: {
                     parts: [{ text: imagePrompt }]
                  },
                  config: {
                     imageConfig: { aspectRatio: "1:1" }
                  }
               });

               // Extract the base64 string
               let base64Image = null;
               for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
                  if (part.inlineData) {
                     base64Image = part.inlineData.data;
                     break;
                  }
               }

               if (base64Image) {
                  returnData.generatedImage = base64Image;
                  toolResponse = { result: "Image generated successfully." };
               } else {
                  toolResponse = { error: "Failed to generate image data." };
               }

            } catch (e) {
               console.error("Image generation error", e);
               toolResponse = { error: "Image generation failed." };
            }
         }

         // Add the model's function call to history
         if (result.candidates && result.candidates[0] && result.candidates[0].content) {
            this.history.push(result.candidates[0].content);
         }

         // Send function response back to the model
         const functionResponsePart = {
             functionResponse: {
                 name: call.name,
                 response: toolResponse
             }
         };
         
         // Send as user role (tool response)
         result = await chat.sendMessage({ message: [functionResponsePart] });
         
         // Add function response to history
         this.history.push({ role: 'user', parts: [functionResponsePart] });
      }

      // Add final model text response to history
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
         this.history.push(result.candidates[0].content);
      }

      const text = result.text || "";
      return { text, ...returnData };

    } catch (error) {
      console.error("Gemini Interaction Error:", error);
      return { text: "I'm having a little trouble right now. Please try again later." };
    }
  }
}

export const getGeminiResponse = async (userMessage: string, language: string = 'en'): Promise<string> => {
  const chat = new ZeinaChat(language);
  const res = await chat.sendMessage(userMessage);
  return res.text;
};
