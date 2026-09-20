const extractJson = (text) => {
  try {
    if (!text) {
      return "";
    }

    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/gi, "")
      .trim();

    const openCurlyBracket = cleanText.indexOf("{");
    const closeCurlyBracket = cleanText.lastIndexOf("}");

    if (openCurlyBracket === -1 || closeCurlyBracket === -1) {
      throw new Error("Invalid JSON format");
    }

    const jsonString = cleanText.slice(
      openCurlyBracket,
      closeCurlyBracket + 1
    );

    return JSON.parse(jsonString);
  } catch (error) {
    console.log("Error in extractJson:", error);
    return null;
  }
};

export default extractJson;