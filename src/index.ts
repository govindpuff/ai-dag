import { executeDAG } from "./dag"
import { DAGNodeFactory } from "./nodeFactory"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, DAGExecutionResult, DAGNode, Model } from "./types"

export const executeWorkflow = async ({
  definition,
  debug = false,
  input,
  apiKey,
}: {
  definition: AiDAGType
  debug: boolean
  input?: string
  apiKey?: string
}): Promise<DAGExecutionResult> => {
  const providerFactory = (model: Model) => createOpenAIProvider(apiKey)

  // Convert plain objects to DAGNode instances
  const nodesWithInstances = Object.entries(definition.nodes).reduce(
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

  const dag: AiDAGType = {
    ...definition,
    nodes: nodesWithInstances,
  }

  return executeDAG({ debug, dag, input, providerFactory })
}

export { DAGNodeFactory } from "./nodeFactory"
export * from "./types"
