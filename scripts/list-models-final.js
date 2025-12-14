const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  console.log("Consultando modelos disponibles para tu clave...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Hack para listar modelos si no hay método directo expuesto fácil en esta versión del SDK,
    // o simplemente probamos uno por uno los comunes.
    // En realidad el SDK tiene getGenerativeModel pero no listModels directo fácil en todas versiones.
    // Usaremos fetch directo para ser infalibles.
    const key = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
    );
    const data = await response.json();

    if (data.models) {
      console.log("✅ Modelos encontrados:");
      data.models.forEach((m) => {
        if (m.name.includes("gemini")) {
          console.log(
            `- ${m.name} (Métodos: ${m.supportedGenerationMethods.join(", ")})`,
          );
        }
      });
    } else {
      console.log(
        "❌ No se encontraron modelos o hubo error:",
        JSON.stringify(data, null, 2),
      );
    }
  } catch (error) {
    console.error("Error fatal:", error.message);
  }
}

listModels();
