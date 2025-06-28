import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export async function analyzeMedicalImage(base64: string, mimeType: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
      {
        text: "Extract and summarize any medical text, notes, or values from this image.",
      },
    ],
  });

  return result.text;
}
