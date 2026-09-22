import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

// 1. Primary: Google Gemini Call
// Priority order me Gemini ke models
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite", // Primary (Fast & high limits)
  "gemini-3.6-flash",      // Latest standard
  "gemini-2.0-flash",      // Reliable fallback
  "gemini-flash-latest",   // Auto-routed alias
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (prompt) => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  let lastGeminiError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Gemini] Attempting with model: ${modelName}...`);

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 65536,
        },
        systemInstruction: `You are an expert web developer.
You MUST ALWAYS return a SINGLE valid RAW JSON object matching this schema:
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT ESCAPED>"
}
CRITICAL RULES FOR JSON VALIDITY:
- All HTML attribute quotes inside "code" MUST use single quotes (e.g. class='container' id='main') or properly escaped quotes (\\").
- Do not output trailing commas or incomplete JSON.
- Never wrap with markdown backticks like \`\`\`json. Return raw JSON.`,
      });

      const result = await model.generateContent(prompt.trim());
      const text = result?.response?.text();

      if (text && text.trim()) {
        console.log(`[Gemini] Success with model: ${modelName}!`);
        return text;
      }
    } catch (error) {
      lastGeminiError = error;
      const status = error?.status;

      console.warn(
        `[Gemini] Model ${modelName} failed (Status: ${status || "unknown"}):`,
        error.message
      );

      // Agar Rate limit (429) ya High Demand / Overloaded (503) ho toh thoda delay leke next model pe shift ho
      if (status === 503 || status === 429) {
        await sleep(1200);
      }
      // Loop agle Gemini model ko try karega
    }
  }

  // Agar saare Gemini models fail ho jayein tab error throw karega taaki OpenRouter trigger ho sake
  throw new Error(
    `All Gemini models failed. Last error: ${lastGeminiError?.message || "Unknown error"}`
  );
};

// 2. Secondary: OpenRouter Fallback Call
const callOpenRouter = async (prompt, modelName) => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPEN_ROUTER_API_KEY not configured");
  }

  const response = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Return ONLY a valid RAW JSON object matching:
{"message": "short confirmation", "code": "<FULL VALID HTML>"}
Never wrap in markdown code blocks.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter ${modelName} error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error(`Empty content returned by ${modelName}`);
  }

  return content;
};

// 3. Main Multi-Provider Fallback Function
const generateResponse = async (prompt) => {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt is required and cannot be empty!");
  }

  // --- Step 1: Try Primary (Gemini) ---
  try {
    console.log("Attempting generation via Gemini...");
    const geminiOutput = await callGemini(prompt);
    console.log("Success with Gemini!");
    return geminiOutput;
  } catch (geminiError) {
    console.warn("Gemini limit/error hit:", geminiError.message);
    console.log("Switching to backup models on OpenRouter...");
  }

  // --- Step 2: Fallback across OpenRouter Models ---
  const fallbackModels = [
    "deepseek/deepseek-chat",
    "mistralai/mistral-7b-instruct:free",
    "cohere/north-mini-code:free",
  ];

  for (const model of fallbackModels) {
    try {
      console.log(`Attempting fallback via ${model}...`);
      const backupOutput = await callOpenRouter(prompt, model);
      console.log(`Success with ${model}!`);
      return backupOutput;
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  throw new Error("All AI models (Gemini & OpenRouter backups) failed to respond.");
};

export default generateResponse;