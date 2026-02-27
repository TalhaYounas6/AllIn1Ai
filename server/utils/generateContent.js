import {AI} from "../config/ai.js"

export const generateContent = async (prompt, length) => {
  const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 8192,
  });

  return response.choices[0].message.content;
};