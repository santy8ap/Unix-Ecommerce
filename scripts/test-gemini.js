const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(
    "Using API Key:",
    process.env.GEMINI_API_KEY ? "Yes (Present)" : "No (Missing)",
  );

  try {
    // For Node.js (commonjs) we might need to use the model manager if exposed,
    // but the SDK documentation suggests just trying to get a model.
    // However, there is no direct "listModels" on the instance in some versions.
    // Let's try a direct fetch if the SDK doesn't expose it easily,
    // OR just try a very basic model often present: "gemini-pro"

    // Actually, newer SDKs don't have a public listModels method on the client instance easily accessible in all versions.
    // Let's try to just run a generation with a generic model and print specific error if catch.

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const result = await model.generateContent("Test");
    console.log("Success with gemini-1.5-flash");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error details:", error.message);
    if (error.response) console.error("API Response:", error.response);
  }
}

listModels();
