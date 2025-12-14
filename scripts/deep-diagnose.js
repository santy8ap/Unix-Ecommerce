const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function diagnose() {
  console.log("--- INICIANDO DIAGNÓSTICO PROFUNDO ---");
  const key = process.env.GEMINI_API_KEY;
  console.log(`API Key presente: ${key ? "SÍ" : "NO"}`);
  if (key) console.log(`API Key (primeros 5): ${key.substring(0, 5)}...`);

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    console.log("Intentando generar contenido simple...");
    const result = await model.generateContent("Hola");
    const response = await result.response;
    console.log("✅ ÉXITO. Respuesta:");
    console.log(response.text());
  } catch (error) {
    console.log("❌ FALLO.");
    console.log("Tipo de error:", error.constructor.name);
    console.log("Mensaje:", error.message);

    if (error.response) {
      console.log("--- DETALLES DE RESPUESTA API ---");
      console.log("Status:", error.response.status);
      console.log("Status Text:", error.response.statusText);
      // Intentar ver si hay más info en el cuerpo del error si es accesible
      try {
        console.log("Error Body:", JSON.stringify(error.response, null, 2));
      } catch (e) {}
    }

    if (error.message.includes("429")) {
      console.log("\n⚠️ CONCLUSIÓN: Es un error de Rate Limit (429).");
      console.log(
        "Significa que la cuenta está saturada o bloqueada temporalmente.",
      );
    } else if (error.message.includes("404")) {
      console.log("\n⚠️ CONCLUSIÓN: Modelo no encontrado (404).");
    }
  }
}

diagnose();
