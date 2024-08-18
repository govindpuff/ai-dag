import { executeNode } from "./node"
import { AiDAGType, NodeOutput, ProviderFactory } from "./types"

const initializeNodeState = (dag: AiDAGType) => {
  const parentCount = new Map<string, number>()
  const completedParents = new Map<string, Set<string>>()
  const nodeInputs = new Map<string, Map<string, string>>()

  Object.entries(dag.nodes).forEach(([id, node]) => {
    parentCount.set(id, 0)
    completedParents.set(id, new Set())
    nodeInputs.set(id, new Map())
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
): Promise<NodeOutput[]> => {
  const { parentCount, completedParents, nodeInputs } = initializeNodeState(dag)
  const results: NodeOutput[] = []
  let queue = [...dag.rootNodes]

  dag.rootNodes.forEach((rootId) => {
    nodeInputs.get(rootId)?.set("input", input)
  })

  while (queue.length > 0) {
    const batch = new Set(queue)
    const batchPromises = Array.from(batch).map(async (id) => {
      const node = dag.nodes[id]
      if (node) {
        const nodeInputString = Array.from(
          nodeInputs.get(id)?.values() || []
        ).join("\n\n")
        if (debug) console.log(`Starting job with id ${id}...`)
        const result = await executeNode(node, nodeInputString, providerFactory)
        if (debug) console.log(`Finished job with id ${id}...`)
        return result
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(
      ...batchResults.filter(
        (result): result is NodeOutput => result !== undefined
      )
    )

    queue = []
    batchResults.forEach((result) => {
      if (result) {
        const node = dag.nodes[result.nodeId]
        if (node) {
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
              !batch.has(childId)
            ) {
              queue.push(childId)
            }
          })
        }
      }
    })
  }

  return results
}
