import { Node } from "./node"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, NodeOutput, ProviderFactory } from "./types"

export class AiDAG {
  private nodes: Map<string, Node>
  private rootNodes: string[]
  private parentCount: Map<string, number>
  private completedParents: Map<string, Set<string>>
  private nodeInputs: Map<string, Map<string, string>>

  constructor(dag: AiDAGType, providerFactory: ProviderFactory) {
    this.nodes = new Map()
    this.rootNodes = dag.rootNodes
    this.parentCount = new Map()
    this.completedParents = new Map()
    this.nodeInputs = new Map()

    for (const [id, nodeData] of Object.entries(dag.nodes)) {
      this.nodes.set(id, new Node(nodeData, providerFactory))
      this.parentCount.set(id, 0)
      this.completedParents.set(id, new Set())
      this.nodeInputs.set(id, new Map())
    }

    // count parents for each node
    for (const [_, nodeData] of Object.entries(dag.nodes)) {
      for (const childId of nodeData.children) {
        this.parentCount.set(childId, (this.parentCount.get(childId) || 0) + 1)
      }
    }
  }

  async execute(input: string, debug = false): Promise<NodeOutput[]> {
    const results: NodeOutput[] = []
    const queue: string[] = [...this.rootNodes]

    for (const rootId of this.rootNodes) {
      this.nodeInputs.get(rootId)?.set("input", input)
    }

    while (queue.length > 0) {
      const batch = new Set(queue)
      const batchPromises: Promise<NodeOutput>[] = []

      for (const id of batch) {
        const node = this.nodes.get(id)
        if (node) {
          const nodeInputs = this.nodeInputs.get(id) || new Map()
          const combinedInput = Array.from(nodeInputs.values()).join("\n\n")

          if (debug) console.log(`Starting job with id ${id}...`)
          batchPromises.push(
            node.execute(combinedInput).then((result) => {
              if (debug) console.log(`Finished job with id ${id}...`)
              return result
            })
          )
        }
      }

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      queue.length = 0
      for (const result of batchResults) {
        const node = this.nodes.get(result.nodeId)
        if (node) {
          const children = node.getChildren()
          for (const childId of children) {
            const childInputs = this.nodeInputs.get(childId) || new Map()
            childInputs.set(result.nodeId, result.result)
            this.nodeInputs.set(childId, childInputs)

            const completedParents =
              this.completedParents.get(childId) || new Set()
            completedParents.add(result.nodeId)
            this.completedParents.set(childId, completedParents)

            const totalParents = this.parentCount.get(childId) || 0
            if (completedParents.size === totalParents && !batch.has(childId)) {
              queue.push(childId)
            }
          }
        }
      }
    }

    return results
  }

  static async executeWorkflow(
    dagDefinition: AiDAGType,
    input: string,
    options: { debug?: boolean } = {}
  ): Promise<NodeOutput[]> {
    const providerFactory = createOpenAIProvider()
    const dag = new AiDAG(dagDefinition, providerFactory)
    return dag.execute(input, options.debug)
  }
}
