import axios from "axios";

class GPTservice {
  static apiKey: string = "Bearer " + process.env.EXPO_PUBLIC_API_KEY;

  public static async generateFillSentence(
    correctWord: String
  ): Promise<string> {
    const prompt = `Create a sentence using the word "${correctWord}". Return ONLY the sentence. The sentence should be in undergraduate level.`;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: this.apiKey, // Replace with your actual API key
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  }
}

export default GPTservice;
