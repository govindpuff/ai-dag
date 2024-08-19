import { DAGNode, NodeOutput, ProviderFactory, NodeParams } from "./types"

export abstract class BaseNode implements DAGNode {
  id: string
  type: string
  params: NodeParams
  children: string[]

  constructor(
    id: string,
    type: string,
    params: NodeParams,
    children: string[]
  ) {
    this.id = id
    this.type = type
    this.params = params
    this.children = children
  }

  abstract execute(
    input: string,
    providerFactory: ProviderFactory
  ): Promise<string>
}

export const executeNode = async (
  node: DAGNode,
  input: string,
  providerFactory: ProviderFactory
): Promise<NodeOutput> => {
  const result = await node.execute(input, providerFactory)

  return {
    nodeId: node.id,
    result,
  }
}
