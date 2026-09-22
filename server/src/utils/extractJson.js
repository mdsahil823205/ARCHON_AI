const extractJson = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    console.error("extractJson received empty or invalid input");
    return null;
  }

  try {
    let cleanText = rawText.trim();

    // 1. Remove Markdown code blocks if present
    if (cleanText.startsWith("```")) {
      cleanText = cleanText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    }

    // 2. Locate outermost JSON boundaries
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("No valid JSON curly brackets found");
    }

    let jsonString = cleanText.slice(firstBrace, lastBrace + 1);

    // 3. Direct Parse Attempt
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      // Direct parse failed, proceed to sanitization
    }

    // 4. Sanitize unescaped control characters (newlines, tabs inside raw strings)
    const sanitized = jsonString.replace(/[\u0000-\u001F]+/g, (match) => {
      if (match === "\n") return "\\n";
      if (match === "\r") return "\\r";
      if (match === "\t") return "\\t";
      return "";
    });

    try {
      const parsed = JSON.parse(sanitized);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      // Proceed to regex field extraction
    }

    // 5. Ultimate Fallback: Regex extraction when string was truncated or malformed
    const messageMatch = jsonString.match(/"message"\s*:\s*"((?:\\.|[^"\\])*)"/);
    const codeMatch = jsonString.match(/"code"\s*:\s*"([\s\S]*)"\s*\}?$/);

    if (codeMatch && codeMatch[1]) {
      const repairedCode = codeMatch[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "");

      return {
        message: messageMatch ? messageMatch[1] : "Website generated successfully.",
        code: repairedCode,
      };
    }

    throw new Error("JSON structure cannot be parsed or repaired.");
  } catch (error) {
    console.error("Error in extractJson:", error.message);
    return null;
  }
};

export default extractJson;