
import { GoogleGenAI } from "@google/genai";

export const editImageWithGemini = async (base64Image, instruction) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `TASK: PROFESSIONAL IMAGE EDITING. Preserve identity 100%. User says: ${instruction}`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No response from AI.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("AI failed to create image.");
  } catch (error) {
    throw new Error(error.message || "Editing failed.");
  }
};
