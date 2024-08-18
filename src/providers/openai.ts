import { OpenAI } from "openai"
import { GenerateTextParams, Model, Provider } from "../types"
import dotenv from "dotenv"

dotenv.config()

export class OpenAIProvider implements Provider {
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
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
  }
}

export const createOpenAIProvider = () => (model: Model) =>
  new OpenAIProvider(process.env.OPENAI_API_KEY! ?? "")
