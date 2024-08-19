import { executeDAG } from "./dag"
import { DAGNodeFactory } from "./nodeFactory"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, DAGExecutionResult, DAGNode, Model } from "./types"

export const executeWorkflow = async (
  dagDefinition: AiDAGType,
  input: string,
  options: { debug: boolean; apiKey?: string } = { debug: false }
): Promise<DAGExecutionResult> => {
  const providerFactory = (model: Model) => createOpenAIProvider(options.apiKey)

  // Convert plain objects to DAGNode instances
  const nodesWithInstances = Object.entries(dagDefinition.nodes).reduce(
    (acc, [id, node]) => {
      acc[id] = DAGNodeFactory.createNode(
        node.type,
        id,
        node.params,
        node.children
      )
      return acc
    },
    {} as Record<string, DAGNode>
  )

  const dagWithInstances: AiDAGType = {
    ...dagDefinition,
    nodes: nodesWithInstances,
  }

  return executeDAG(dagWithInstances, input, providerFactory, options)
}

export { DAGNodeFactory } from "./nodeFactory"
export * from "./types"
