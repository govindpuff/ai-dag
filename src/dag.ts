import { executeNode } from "./node"
import {
  AiDAGType,
  DAGExecutionResult,
  NodeOutput,
  ProviderFactory,
} from "./types"

const initializeNodeState = (dag: AiDAGType) => {
  const parentCount = new Map<string, number>()
  const completedParents = new Map<string, Set<string>>()
  const nodeInputs = new Map<string, Map<string, string>>()

  // Initialize parentCount for all nodes to 0
  Object.keys(dag.nodes).forEach((id) => {
    parentCount.set(id, 0)
    completedParents.set(id, new Set())
    nodeInputs.set(id, new Map())
  })

  // Count parents for each node
  Object.entries(dag.nodes).forEach(([id, node]) => {
    node.children.forEach((childId) => {
      parentCount.set(childId, (parentCount.get(childId) || 0) + 1)
    })
  })

  return { parentCount, completedParents, nodeInputs }
}

export const executeDAG = async (
  dag: AiDAGType,
  input: string,
  providerFactory: ProviderFactory,
  debug = false
): Promise<DAGExecutionResult> => {
  const { parentCount, completedParents, nodeInputs } = initializeNodeState(dag)
  const intermediateResults: NodeOutput[] = []
  const leafResults: NodeOutput[] = []
  let queue = [...dag.rootNodes]
  const processedNodes = new Set<string>()

  dag.rootNodes.forEach((rootId) => {
    nodeInputs.get(rootId)?.set("input", input)
  })

  while (queue.length > 0) {
    const batch = new Set(queue)
    const batchPromises = Array.from(batch).map(async (id) => {
      const node = dag.nodes[id]
      if (node && !processedNodes.has(id)) {
        const nodeInputString = Array.from(
          nodeInputs.get(id)?.values() || []
        ).join("\n\n")

        if (debug) {
          console.log(`Starting job with id ${id}.`)
        }
        const result = await executeNode(node, nodeInputString, providerFactory)
        if (debug) {
          console.log(`Finished job with id ${id}. Output:\n`)
          console.log(result)
        }
        processedNodes.add(id)
        return result
      }
    })

    const batchResults = await Promise.all(batchPromises)
    const validResults = batchResults.filter(
      (result): result is NodeOutput => result !== undefined
    )

    queue = []
    validResults.forEach((result) => {
      const node = dag.nodes[result.nodeId]
      if (node) {
        if (node.children.length === 0) {
          leafResults.push(result)
        } else {
          intermediateResults.push(result)
        }

        node.children.forEach((childId) => {
          const childInputs = nodeInputs.get(childId) || new Map()
          childInputs.set(result.nodeId, result.result)
          nodeInputs.set(childId, childInputs)

          const childCompletedParents =
            completedParents.get(childId) || new Set()
          childCompletedParents.add(result.nodeId)
          completedParents.set(childId, childCompletedParents)

          const totalParents = parentCount.get(childId) || 0

          if (
            childCompletedParents.size === totalParents &&
            !processedNodes.has(childId)
          ) {
            queue.push(childId)
          }
        })
      }
    })
  }

  return {
    output: leafResults,
    intermediate: intermediateResults,
  }
}
