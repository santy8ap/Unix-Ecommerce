const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function verifyModel() {
  console.log("Testing model: gemini-2.0-flash");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      "Say 'Hello from Gemini 2.0' if you can read this.",
    );
    const response = await result.response;
    console.log("SUCCESS! API Response:");
    console.log(response.text());
  } catch (error) {
    console.error("FAILED.");
    console.error("Error message:", error.message);
  }
}

verifyModel();
