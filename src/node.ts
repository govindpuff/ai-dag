import {
  Node as NodeType,
  NodeOutput,
  NodeParams,
  ProviderFactory,
} from "./types"

export const executeNode = async (
  node: NodeType,
  input: string,
  providerFactory: ProviderFactory
): Promise<NodeOutput> => {
  const params: NodeParams = {
    ...node.params,
    prompt: `${node.params.prompt}\n${input}`,
  }

  const provider = providerFactory(params.model)
  const result = await provider.generateText(params)

  return {
    nodeId: node.id,
    result,
  }
}
