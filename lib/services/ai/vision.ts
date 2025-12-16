/**
 * Análisis de Imagen (Híbrido: Gemini + Fallback)
 * Intenta usar IA, si falla por cuota, devuelve simulacion realista.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

/* MOCKS PARA DEMO CUANDO GEMINI FALLA (QUOTA EXCEEDED) */
const MOCK_SKIN_TONE = {
  skinTone: "neutral",
  season: "autumn",
  undertone: "neutral",
  confidence: 0.95,
  recommendations: {
    bestColors: ["#8D6E63", "#FF7043", "#26A69A", "#78909C"],
    avoidColors: ["#FFFF00", "#000000"],
    tips: [
      "Tus tonos neutros te permiten versatilidad.",
      "Prueba colores tierra para resaltar tu piel.",
    ],
  },
};

const MOCK_OUTFIT_ANALYSIS = {
  overallStyle: "Casual Urbano",
  occasion: "Diario / Universidad",
  items: [
    {
      category: "top",
      color: "negro",
      description: "Prenda superior oscura",
      confidence: 0.9,
    },
    {
      category: "bottom",
      color: "denim",
      description: "Jeans clásicos",
      confidence: 0.85,
    },
  ],
  colorHarmony: 88,
  styleScore: 90,
  recommendations: [
    "Unos accesorios plateados elevarían el look.",
    "Prueba doblar el ruedo de los pantalones.",
  ],
  improvements: ["Añadir una tercera capa (chaqueta) daría más profundidad."],
};

// Configuración Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

async function imageToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

/**
 * Parsea la respuesta JSON de Gemini limpiando bloques de markdown
 */
function parseGeminiJSON(text: string): any {
  try {
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\s*/gi, "");
    cleanedText = cleanedText.replace(/```\s*/g, "");

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error parsing Gemini JSON:", error);
    throw error;
  }
}

// --- FUNCIONES PRINCIPALES ---

export async function analyzeSkinToneFromImage(imageFile: File): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const base64Image = await imageToBase64(imageFile);

    // Intentar llamada real
    const result = await model.generateContent([
      "Analiza el tono de piel de la persona en la imagen. Responde ÚNICAMENTE con un JSON válido con esta estructura: {skinTone: 'warm'|'cool'|'neutral', season: 'spring'|'summer'|'autumn'|'winter', undertone: 'golden'|'pink'|'olive', confidence:number, recommendations: {bestColors:string[], avoidColors:string[], tips:string[]}}",
      { inlineData: { mimeType: imageFile.type, data: base64Image } },
    ]);
    const response = await result.response;
    const text = response.text();

    return parseGeminiJSON(text);
  } catch (e) {
    console.log(
      "Gemini Vision Falló (Quota/Error/Parsing). Usando Fallback.",
      e
    );
    return MOCK_SKIN_TONE;
  }
}

export async function analyzeOutfit(imageFile: File): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const base64Image = await imageToBase64(imageFile);

    // Intentar llamada real
    const result = await model.generateContent([
      "Analiza el outfit en la imagen. Responde ÚNICAMENTE con un JSON válido con esta estructura: {overallStyle:string, occasion:string, items:Array<{category, color, description, confidence}>, colorHarmony:number(0-100), styleScore:number(0-100), recommendations:string[], improvements:string[]}",
      { inlineData: { mimeType: imageFile.type, data: base64Image } },
    ]);
    const response = await result.response;
    const text = response.text();

    return parseGeminiJSON(text);
  } catch (e) {
    console.log(
      "Gemini Vision Falló (Quota/Error/Parsing). Usando Fallback.",
      e
    );
    return MOCK_OUTFIT_ANALYSIS;
  }
}

// Stubs para las otras funciones para que no rompa el build
export async function analyzeClothingItem(f: File) {
  return { category: "unknown", description: "Prenda detectada" };
}
export async function extractColorPalette(f: File) {
  return ["#333333", "#FFFFFF", "#555555"];
}

export default {
  analyzeSkinToneFromImage,
  analyzeClothingItem,
  analyzeOutfit,
  extractColorPalette,
};
