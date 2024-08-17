import {
  Node as NodeType,
  ProviderFactory,
  NodeOutput,
  NodeParams,
} from "./types"

export class Node {
  private node: NodeType
  private providerFactory: ProviderFactory

  constructor(node: NodeType, providerFactory: ProviderFactory) {
    this.node = node
    this.providerFactory = providerFactory
  }

  async execute(input: string): Promise<NodeOutput> {
    const params: NodeParams = {
      ...this.node.params,
      prompt: `${this.node.params.prompt}\n${input}`,
    }

    const provider = this.providerFactory(params.model)
    const result = await provider.generateText(params)

    return {
      nodeId: this.node.id,
      result,
    }
  }

  getChildren(): string[] {
    return this.node.children
  }
}
