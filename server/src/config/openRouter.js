const openUrl = "https://openrouter.ai/api/v1/chat/completions";
const deepseekmodel = "deepseek/deepseek-chat";
const cohereModel="cohere/north-mini-code:free"
const poolsideModel="poolside/laguna-s-2.1:free"
const nvediaModel="nvidia/nemotron-3-ultra-550b-a55b:free"
const generateResponse = async (prompt) => {
  try {
    const response = await fetch(openUrl, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: cohereModel,

        messages: [
          {
            role: "system",
            content: "You must return ONLY valid RAW JSON",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content)
    return data.choices[0].message.content;
  } catch (error) {
    console.log("Error in generateResponse:", error);
    throw error;
  }
};

export default generateResponse;