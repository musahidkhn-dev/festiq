import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service for Gemini Integration
 * Handles model fallback and detailed error reporting.
 */
class AIService {
  constructor() {
    // Priority: Try GEMINI_API_KEY first, then GOOGLE_API_KEY
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    this.models = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
    ];

    if (!this.apiKey) {
      console.error("AI_SERVICE: [CRITICAL] No API Key found in environment variables.");
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.apiVersion = 'v1beta';
  }

  /**
   * Generates content with detailed error diagnostics.
   * @param {string} prompt - The full system + user prompt
   * @returns {Promise<string>} - The generated AI response
   */
  async generateResponse(prompt) {
    let lastError = null;

    // Use v1beta as it is generally more feature-complete for latest models
    const apiVersion = 'v1beta';

    for (const modelName of this.models) {
      try {
        console.log(`AI_SERVICE: Attempting generation with model: ${modelName} [${apiVersion}]`);

        const model = this.genAI.getGenerativeModel({
          model: modelName,
        }, { apiVersion: this.apiVersion });

        // generateContent call
        // const result = await model.generateContent({
        //   contents: [{ role: "user", parts: [{ text: prompt }] }],
        //   generationConfig: {
        //     maxOutputTokens: 2048,
        //     temperature: 0.7,
        //   }
        // });
        const result = await model.generateContent(prompt);

        const response = await result.response;
        const text = response.text();

        if (!text) {
          throw new Error("API returned an empty response body.");
        }

        console.log(`AI_SERVICE: [SUCCESS] Model: ${modelName}`);
        return text;

      } catch (err) {
        lastError = err;

        // LOGGING THE ACTUAL SDK ERROR FOR DEBUGGING
        console.error(`AI_SERVICE: [FAILURE] Model ${modelName} failed.`);
        console.error(`Error Message: ${err.message}`);

        if (err.stack) {
          console.error(`Stack Trace: ${err.stack.split('\n').slice(0, 3).join('\n')}`);
        }

        // Catch specific API errors
        if (err.message.includes("API_KEY_INVALID") || err.message.includes("403") || err.message.includes("unauthorized")) {
          throw new Error("AI_CONFIG_ERROR: Your API Key is invalid or unauthorized. Please verify GEMINI_API_KEY in your .env file.");
        }

        if (err.message.includes("User location is not supported")) {
          throw new Error("AI_REGION_ERROR: Gemini is not available in your region. Please try using a VPN or wait for regional support.");
        }

        // If it's a 404, we continue to the next model
        if (err.message.includes("404") || err.message.includes("not found")) {
          console.warn(`AI_SERVICE: Model ${modelName} not found or unsupported for this key/region.`);
          continue;
        }

        // For other errors (quota, etc), we might want to stop early but here we continue
        continue;
      }
    }

    // All models failed
    console.error("AI_SERVICE: [FATAL] All attempted models failed.");

    // Provide a detailed error message based on the last failure
    const diagnosticMessage = lastError?.message || "Unknown AI error";

    throw new Error(`Nova AI Failure: ${diagnosticMessage}. 
    This usually means the 'Generative Language API' is not enabled for your project, 
    or the models are restricted for your API key. 
    Please visit: https://aistudio.google.com/ to verify your key and model access.`);
  }
}

const aiService = new AIService();
export default aiService;
