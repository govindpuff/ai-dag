import OpenAI from "openai"

export type Model = OpenAI.Chat.ChatModel | (string & {})

export interface NodeParams {
  prompt: string
  model: Model
  temperature?: number
  max_tokens?: number
}

export interface Node {
  id: string
  params: NodeParams
  children: string[]
}

export interface AiDAGType {
  nodes: Record<string, Node>
  rootNodes: string[]
}

export interface NodeOutput {
  nodeId: string
  result: string
}

export interface GenerateTextParams {
  prompt: string
  model: Model
  temperature?: number
  max_tokens?: number
}

export interface Provider {
  generateText(params: GenerateTextParams): Promise<string>
}

export type DAGExecutionResult = NodeOutput[]

export type ProviderFactory = (model: Model) => Provider
