import OpenAI from "openai"

export type Model = OpenAI.Chat.ChatModel | (string & {})

export interface NodeParams {}

export interface AINodeParams extends NodeParams {
  prompt: string
  model: Model
  temperature?: number
  max_tokens?: number
}

export interface HTTPNodeParams extends NodeParams {
  url: string
  method: "GET" | "POST"
  body?: string
  outputPath: string
  headers?: Record<string, string>
}

export interface DAGNode {
  id: string
  type: string
  params: NodeParams
  children: string[]
  execute: (input: string, providerFactory: ProviderFactory) => Promise<string>
}

export interface AiDAGType {
  nodes: Record<string, DAGNode>
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
  generateText: (params: GenerateTextParams) => Promise<string>
}

export interface DAGExecutionResult {
  output: NodeOutput[]
  intermediate: NodeOutput[]
}

export type ProviderFactory = (model: Model) => Provider
