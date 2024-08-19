import { DAGNode, AINodeParams, ProviderFactory } from "../types"

export class AINode implements DAGNode {
  id: string
  type: string
  params: AINodeParams
  children: string[]

  constructor(id: string, params: AINodeParams, children: string[]) {
    this.id = id
    this.type = "AI"
    this.params = params
    this.children = children
  }

  async execute(
    input: string,
    providerFactory: ProviderFactory
  ): Promise<string> {
    const { prompt, model, temperature, max_tokens } = this.params
    const provider = providerFactory(model)
    const fullPrompt = `${prompt}\n${input}`
    return await provider.generateText({
      prompt: fullPrompt,
      model,
      temperature,
      max_tokens,
    })
  }
}
