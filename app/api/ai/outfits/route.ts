import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface OutfitRequest {
  closet: string[];
  colorimetria: string;
  estilo: string;
}

interface Outfit {
  nombre: string;
  descripcion: string;
  piezas: string[];
}

interface OutfitResponse {
  outfits: Outfit[];
}

export async function POST(req: Request) {
  let body: OutfitRequest;
  
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud. Verifica el formato JSON." },
      { status: 400 }
    );
  }

  const { closet, colorimetria, estilo } = body;

  // Validate basic data
  if (!closet || !Array.isArray(closet) || closet.length === 0) {
    return NextResponse.json(
      {
        error:
          "Por favor proporciona una lista de prendas en tu armario (closet).",
      },
      { status: 400 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Error de configuración: GEMINI_API_KEY no encontrada." },
      { status: 500 },
    );
  }

  // Configure Gemini with a stable model
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Build the prompt
    const prompt = `
      Actúa como un estilista de moda experto.
      
      Tengo estas prendas en mi armario: ${closet.join(", ")}.
      Mi colorimetría es: ${colorimetria || "No especificada"}.
      Mi estilo preferido es: ${estilo || "Casual"}.

      Genera 3 sugerencias de outfits combinando MIS prendas. Puedes sugerir accesorios básicos genéricos si hacen falta.
      
      IMPORTANTE: Tu respuesta debe ser EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta, sin texto adicional ni markdown:
      {
        "outfits": [
          {
            "nombre": "Nombre creativo del outfit",
            "descripcion": "Breve explicación de por qué funciona (máx 20 palabras)",
            "piezas": ["pieza 1", "pieza 2", "pieza 3"]
          }
        ]
      }
    `;

    // Generate content with Retry Logic
    const generateWithRetry = async (retries = 3, delay = 2000) => {
      try {
        return await model.generateContent(prompt);
      } catch (err: any) {
        if (
          retries > 0 &&
          (err.message?.includes("429") || err.message?.includes("503"))
        ) {
          console.log(
            `Rate limit hit. Retrying in ${delay}ms... (${retries} attempts left)`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return generateWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    };

    const result = await generateWithRetry();
    const response = await result.response;
    let text = response.text();

    // Clean up the response (remove markdown code blocks if present)
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse and validate JSON
    let data: OutfitResponse;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("La respuesta de la IA no es un JSON válido");
    }

    // Validate response structure
    if (!data.outfits || !Array.isArray(data.outfits)) {
      throw new Error("La respuesta no tiene la estructura esperada");
    }

    // Ensure we have exactly 3 outfits
    const validOutfits = data.outfits
      .filter((outfit) => outfit.nombre && outfit.descripcion && Array.isArray(outfit.piezas))
      .slice(0, 3);

    if (validOutfits.length === 0) {
      throw new Error("No se pudieron generar outfits válidos");
    }

    return NextResponse.json({ outfits: validOutfits });
  } catch (error: any) {
    console.error("Error generating outfits:", error.message);

    // Fallback: Return mock data using the original request body
    const mockOutfits: OutfitResponse = {
      outfits: [
        {
          nombre: "Estilo Urbano Relax (Modo Demo)",
          descripcion:
            "Combinación cómoda y moderna ideal para el día a día sin perder estilo.",
          piezas: [
            closet[0] || "Jeans",
            "Camiseta básica",
            "Zapatillas blancas",
          ],
        },
        {
          nombre: "Smart Casual Oficina (Modo Demo)",
          descripcion:
            "Equilibrio perfecto entre profesionalismo y comodidad para el trabajo.",
          piezas: [closet[1] || closet[0] || "Camisa", "Pantalón chino", "Mocasines"],
        },
        {
          nombre: "Noche de Salida (Modo Demo)",
          descripcion:
            "Un look con más personalidad para destacar en eventos sociales.",
          piezas: [
            closet[0] || "Chaqueta de cuero",
            "Camiseta negra",
            "Botas Chelsea",
          ],
        },
      ],
    };

    return NextResponse.json(mockOutfits);
  }
}
