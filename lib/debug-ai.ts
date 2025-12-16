const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, are you working?");
    console.log(`Success with ${modelName}:`, result.response.text());
    return true;
  } catch (e) {
    console.error(`Failed with ${modelName}:`, e.message);
    return false;
  }
}

async function main() {
  await testModel("gemini-2.0-flash");
  await testModel("gemini-1.5-flash");
}

main();
