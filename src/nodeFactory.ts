import { AINode } from "./nodes/AINode"
import { HTTPNode } from "./nodes/HTTPNode"
import { AINodeParams, DAGNode, HTTPNodeParams, NodeParams } from "./types"

export class DAGNodeFactory {
  static createNode(
    type: string,
    id: string,
    params: NodeParams,
    children: string[]
  ): DAGNode {
    switch (type) {
      case "AI":
        return new AINode(id, params as AINodeParams, children)
      case "HTTP":
        return new HTTPNode(id, params as HTTPNodeParams, children)
      default:
        throw new Error(`Unknown node type: ${type}`)
    }
  }
}
