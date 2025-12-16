/**
 *
 * Servicio de IA Gemini para UNIX
 * Gestiona la integración con Google Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY no está definida en las variables de entorno"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Configuración del modelo Gemini
 */
export const getGeminiModel = (modelName: string = "gemini-flash-latest") => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Tipos de respuestas de IA
 */
export interface OutfitSuggestion {
  name: string;
  description: string;
  items: OutfitItem[];
  occasion: string;
  confidence: number;
  stylingTips: string[];
}

export interface OutfitItem {
  id?: string;
  name: string;
  category: string;
  color: string;
  source: "closet" | "store";
  productId?: string;
  reason: string;
}

export interface ColorimetryAnalysis {
  skinTone: "warm" | "cool" | "neutral";
  season: "spring" | "summer" | "autumn" | "winter";
  undertone: "golden" | "pink" | "olive";
  bestColors: string[];
  goodColors: string[];
  avoidColors: string[];
  recommendations: {
    metals: string[];
    patterns: string[];
    fabrics: string[];
    generalTips: string[];
  };
}

/**
 * Genera análisis de colorimetría basado en características del usuario
 */
export async function generateColorimetryAnalysis(params: {
  skinTone: string;
  hairColor?: string;
  eyeColor?: string;
}): Promise<ColorimetryAnalysis> {
  const model = getGeminiModel();

  const prompt = `Eres un experto asesor de imagen y colorimetría personal. 

Analiza el perfil del usuario:
- Tono de piel: ${params.skinTone}
${params.hairColor ? `- Color de cabello: ${params.hairColor}` : ""}
${params.eyeColor ? `- Color de ojos: ${params.eyeColor}` : ""}

Genera un análisis de colorimetría completo y personalizado.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta estructura exacta:
{
  "skinTone": "warm" | "cool" | "neutral",
  "season": "spring" | "summer" | "autumn" | "winter",
  "undertone": "golden" | "pink" | "olive",
  "bestColors": ["#HEX1", "#HEX2", ...],
  "goodColors": ["#HEX1", "#HEX2", ...],
  "avoidColors": ["#HEX1", "#HEX2", ...],
  "recommendations": {
    "metals": ["oro", "plata", etc],
    "patterns": ["rayas", "flores", etc],
    "fabrics": ["algodón", "seda", etc],
    "generalTips": ["consejo 1", "consejo 2", ...]
  }
}

Asegúrate de que todo sea JSON válido. No incluyas explicaciones fuera del JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Limpiar respuesta de Gemini (puede venir con ```json o texto adicional)
    let cleanedText = text.trim();

    // Remover bloques de código markdown
    cleanedText = cleanedText.replace(/```json\s*/gi, "");
    cleanedText = cleanedText.replace(/```\s*/g, "");

    // Buscar el objeto JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No se encontró JSON en la respuesta de Gemini");
      console.error("Respuesta completa:", text);
      throw new Error("No se encontró JSON en la respuesta de IA");
    }

    const analysis = JSON.parse(jsonMatch[0]) as ColorimetryAnalysis;
    return analysis;
  } catch (error) {
    console.error("Error parseando respuesta de Gemini:", error);
    console.error("Respuesta rec ibida:", text);
    throw new Error(
      "Error procesando análisis de colorimetría. La IA devolvió un formato inválido."
    );
  }
}

/**
 * Genera sugerencias de outfits basados en el closet del usuario
 */
export async function generateOutfits(params: {
  closetItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    brand?: string;
  }>;
  userPreferences: {
    skinTone?: string;
    styleType?: string;
  };
  occasion?: string;
  season?: string;
  numberOfOutfits?: number;
}): Promise<OutfitSuggestion[]> {
  const model = getGeminiModel();

  const {
    closetItems,
    userPreferences,
    occasion = "casual",
    season = "all-season",
    numberOfOutfits = 3,
  } = params;

  const prompt = `Eres un experto asesor de moda personal. Tu tarea es crear ${numberOfOutfits} outfits completos y estilosos.

INFORMACIÓN DEL USUARIO:
- Tono de piel: ${userPreferences.skinTone || "No especificado"}
- Estilo preferido: ${userPreferences.styleType || "Versátil"}

PRENDAS DISPONIBLES EN EL CLOSET:
${closetItems
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} (${item.category}) - Color: ${item.color} - ID: ${
        item.id
      }`
  )
  .join("\n")}

CRITERIOS:
- Ocasión: ${occasion}
- Temporada: ${season}
- Número de outfits: ${numberOfOutfits}

INSTRUCCIONES:
1. Crea ${numberOfOutfits} outfits completos y balanceados
2. Cada outfit debe incluir al menos 3-4 prendas
3. Considera la armonía de colores y estilos
4. Asegúrate de que las combinaciones sean prácticas
5. Proporciona consejos de estilismo

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional:
{
  "outfits": [
    {
      "name": "Nombre atractivo del outfit",
      "description": "Por qué funciona este outfit",
      "items": [
        {
          "id": "ID de la prenda del closet",
          "name": "Nombre de la prenda",
          "category": "categoría",
          "color": "color",
          "source": "closet",
          "reason": "Por qué se eligió esta prenda"
        }
      ],
      "occasion": "${occasion}",
      "confidence": 0.95,
      "stylingTips": ["consejo 1", "consejo 2", ...]
    }
  ]
}

Solo responde con el JSON, sin explicaciones adicionales.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Limpiar respuesta de markdown
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\s*/gi, "");
    cleanedText = cleanedText.replace(/```\s*/g, "");

    // Extraer JSON del texto
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No se encontró JSON en la respuesta de Gemini");
      console.error("Respuesta completa:", text);
      throw new Error("No se encontró JSON en la respuesta de IA");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.outfits as OutfitSuggestion[];
  } catch (error) {
    console.error("Error parseando respuesta de Gemini:", error);
    console.error("Respuesta recibida:", text);
    throw new Error("Error generando outfits con IA. Intenta de nuevo.");
  }
}

/**
 * Genera outfits mezclando prendas del closet con productos de la tienda
 */
export async function generateEnhancedOutfits(params: {
  closetItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
  }>;
  storeProducts: Array<{
    id: string;
    name: string;
    category: string;
    colors: string[];
    price: number;
  }>;
  userPreferences: {
    skinTone?: string;
    styleType?: string;
  };
  occasion?: string;
  budget?: number;
  numberOfOutfits?: number;
}): Promise<OutfitSuggestion[]> {
  const model = getGeminiModel();

  const {
    closetItems,
    storeProducts,
    userPreferences,
    occasion = "casual",
    budget,
    numberOfOutfits = 3,
  } = params;

  const prompt = `Eres un experto asesor de moda que ayuda a las personas a crear outfits perfectos combinando lo que ya tienen con nuevas compras inteligentes.

INFORMACIÓN DEL USUARIO:
- Tono de piel: ${userPreferences.skinTone || "No especificado"}
- Estilo: ${userPreferences.styleType || "Versátil"}
${budget ? `- Presupuesto máximo: $${budget}` : ""}

PRENDAS EN EL CLOSET:
${closetItems
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} (${item.category}) - ${item.color} - ID: ${
        item.id
      }`
  )
  .join("\n")}

PRODUCTOS DISPONIBLES EN LA TIENDA:
${storeProducts
  .map(
    (p, i) =>
      `${i + 1}. ${p.name} (${p.category}) - Colores: ${p.colors.join(
        ", "
      )} - $${p.price} - ID: ${p.id}`
  )
  .join("\n")}

TAREA:
Crea ${numberOfOutfits} outfits mezclando prendas del closet con productos de la tienda.
- Ocasión: ${occasion}
- Prioriza usar prendas del closet
- Sugiere productos de la tienda que complementen el outfit
- Respeta el presupuesto si está definido
- Explica por qué cada prenda fue seleccionada

IMPORTANTE: Responde ÚNICAMENTE con JSON válido:
{
  "outfits": [
    {
      "name": "Nombre del outfit",
      "description": "Descripción y justificación",
      "items": [
        {
          "id": "ID de la prenda o producto",
          "name": "Nombre",
          "category": "categoría",
          "color": "color principal",
          "source": "closet" | "store",
          "productId": "ID si es de tienda",
          "reason": "Por qué se eligió"
        }
      ],
      "occasion": "${occasion}",
      "confidence": 0.9,
      "stylingTips": ["consejo 1", ...]
    }
  ]
}

Solo el JSON, sin texto adicional.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Limpiar respuesta de markdown
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\s*/gi, "");
    cleanedText = cleanedText.replace(/```\s*/g, "");

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No se encontró JSON en la respuesta de Gemini");
      console.error("Respuesta completa:", text);
      throw new Error("No se encontró JSON en la respuesta de IA");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.outfits as OutfitSuggestion[];
  } catch (error) {
    console.error("Error parseando respuesta de Gemini:", error);
    console.error("Respuesta recibida:", text);
    throw new Error(
      "Error generando outfits mejorados con IA. Intenta de nuevo."
    );
  }
}

/**
 * Analiza si un producto es recomendado para el usuario
 */
export async function analyzeProductRecommendation(params: {
  product: {
    name: string;
    category: string;
    colors: string[];
    description: string;
  };
  userPreferences: {
    skinTone?: string;
    styleType?: string;
  };
}): Promise<{
  isRecommended: boolean;
  score: number;
  reasons: string[];
}> {
  const { product, userPreferences } = params;

  // Lógica básica de recomendación (puede ser mejorada con IA)
  const reasons: string[] = [];
  let score = 0;

  // Aumentar score si coincide con el estilo
  if (userPreferences.styleType && product.category) {
    score += 0.3;
    reasons.push(`Coincide con tu estilo ${userPreferences.styleType}`);
  }

  // Lógica simple de colorimetría
  if (userPreferences.skinTone) {
    const warmColors = ["beige", "brown", "orange", "gold", "warm"];
    const coolColors = ["blue", "silver", "gray", "pink", "purple"];

    const productColors = product.colors.join(" ").toLowerCase();

    if (
      userPreferences.skinTone === "warm" &&
      warmColors.some((c) => productColors.includes(c))
    ) {
      score += 0.5;
      reasons.push("Los colores favorecen tu tono de piel cálido");
    } else if (
      userPreferences.skinTone === "cool" &&
      coolColors.some((c) => productColors.includes(c))
    ) {
      score += 0.5;
      reasons.push("Los colores favorecen tu tono de piel frío");
    } else if (userPreferences.skinTone === "neutral") {
      score += 0.4;
      reasons.push("Los colores son versátiles para tu tono neutro");
    }
  }

  return {
    isRecommended: score >= 0.5,
    score,
    reasons,
  };
}

export default {
  generateColorimetryAnalysis,
  generateOutfits,
  generateEnhancedOutfits,
  analyzeProductRecommendation,
  getGeminiModel,
};
