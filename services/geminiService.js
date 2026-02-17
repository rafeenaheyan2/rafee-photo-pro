
import { GoogleGenAI } from "@google/genai";

export const editImageWithGemini = async (base64Image, instruction) => {
  // Ensure we have an API key
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API Key পাওয়া যায়নি। দয়া করে আপনার Cloudflare Pages সেটিংস চেক করুন।");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `TASK: PROFESSIONAL IMAGE EDITING. 
    Preserve identity 100%. 
    Instructions: ${instruction}. 
    Output must be a high-quality modified version of the provided person.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("AI থেকে কোনো রেসপন্স পাওয়া যায়নি। সম্ভবত সেফটি ফিল্টারের কারণে ব্লক হয়েছে।");
    }

    const candidate = response.candidates[0];
    
    // Look for image data in parts
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      } else if (part.text) {
        // If AI only returned text, it might be a refusal or explanation
        console.warn("AI returned text instead of image:", part.text);
        throw new Error("AI ছবি তৈরি করতে ব্যর্থ হয়েছে। মেসেজ: " + part.text.substring(0, 100));
      }
    }
    
    throw new Error("AI ইমেজ ডেটা পাঠাতে পারেনি। অনুগ্রহ করে অন্য কোনো ছবি দিয়ে চেষ্টা করুন।");
  } catch (error) {
    console.error("Gemini Image API Error:", error);
    if (error.message?.includes("403")) {
      throw new Error("API Key পারমিশন এরর। আপনার কী-টি সঠিক কিনা তা যাচাই করুন।");
    }
    if (error.message?.includes("429")) {
      throw new Error("বেশিবার রিকোয়েস্ট পাঠানো হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।");
    }
    throw new Error(error.message || "এডিটিং ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
  }
};
