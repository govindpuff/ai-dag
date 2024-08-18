import { OpenAI } from "openai"
import { GenerateTextParams, Provider } from "../types"
import dotenv from "dotenv"

dotenv.config()

export const createOpenAIProvider = (apiKey?: string): Provider => {
  const openai = new OpenAI({ apiKey: apiKey ?? process.env.OPENAI_API_KEY })

  return {
    generateText: async (params: GenerateTextParams): Promise<string> => {
      try {
        const response = await openai.chat.completions.create({
          model: params.model,
          messages: [{ role: "user", content: params.prompt }],
          temperature: params.temperature || 0.8,
          max_tokens: params.max_tokens,
        })

        return response.choices[0].message.content?.trim() || ""
      } catch (error) {
        console.error("Error generating text:", error)
        throw error
      }
    },
  }
}
