
import { GoogleGenAI } from "@google/genai";

/**
 * Internal helper to call the generation models.
 */
async function generate(ai, modelName, imagePart, textPart) {
  const config = {
    imageConfig: {
      aspectRatio: "1:1",
      imageSize: modelName.includes("pro") ? "1K" : undefined
    }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts: [imagePart, textPart] },
    config: modelName.includes("pro") ? config : undefined
  });

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("AI generation was blocked by safety filters.");
  }

  const candidate = response.candidates[0];
  for (const part of candidate.content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
}

/**
 * Edits an image using Gemini models with an automatic fallback for permission issues.
 */
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
    text: `TASK: PROFESSIONAL HIGH-END IMAGE MODIFICATION.
    CRITICAL RULES:
    1. IDENTITY PRESERVATION: Keep the person's facial features and eyes 100% unchanged.
    2. REQUEST: ${instruction}.
    3. OUTPUT: High-resolution photographic image.`
  };

  try {
    // Attempt with High-Quality Pro model first
    console.log("Attempting generation with gemini-3-pro-image-preview...");
    const result = await generate(ai, 'gemini-3-pro-image-preview', imagePart, textPart);
    if (result) return result;
    throw new Error("No image data returned from Pro model.");
  } catch (error) {
    const errString = JSON.stringify(error).toLowerCase();
    const isPermissionError = errString.includes("403") || errString.includes("permission_denied") || errString.includes("not have permission");

    if (isPermissionError) {
      console.warn("Pro model access denied. Falling back to gemini-2.5-flash-image...");
      try {
        // Fallback to Flash model which is usually available on free/standard tiers
        const result = await generate(ai, 'gemini-2.5-flash-image', imagePart, textPart);
        if (result) return result;
        throw new Error("No image data returned from Flash model.");
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
        throw new Error("Both Pro and Flash models failed. Please check your API key permissions and billing status at ai.google.dev/gemini-api/docs/billing");
      }
    }

    // If it wasn't a permission error, rethrow it
    console.error("Gemini API Error:", error);
    throw error;
  }
};
