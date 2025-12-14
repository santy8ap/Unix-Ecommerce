const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testModel(modelName) {
  console.log(`\n--- Probando modelo: ${modelName} ---`);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    const result = await model.generateContent("Hola, ¿funcionas?");
    const response = await result.response;
    console.log(`✅ ¡ÉXITO! El modelo ${modelName} respondió:`);
    console.log(response.text().substring(0, 50) + "...");
    return true;
  } catch (error) {
    console.log(`❌ ERROR con ${modelName}:`);
    console.log(error.message);
    return false;
  }
}

async function runTests() {
  console.log("Iniciando pruebas de modelos con la nueva Key...");

  // Probar el estándar estable
  const success15 = await testModel("gemini-1.5-flash");

  // Probar el experimental
  const success20 = await testModel("gemini-2.0-flash");

  // Probar el Pro
  const successPro = await testModel("gemini-pro");

  if (!success15 && !success20 && !successPro) {
    console.log(
      "\n⚠️ CONCLUSIÓN: Ningún modelo funciona. Probablemente 'Quota: 0' en la cuenta.",
    );
  }
}

runTests();
