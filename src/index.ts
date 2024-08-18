import { executeDAG } from "./dag"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, NodeOutput } from "./types"

export const executeWorkflow = async (
  dagDefinition: AiDAGType,
  input: string,
  options: { debug?: boolean } = {}
): Promise<NodeOutput[]> => {
  const providerFactory = (model: string) => createOpenAIProvider()
  return executeDAG(dagDefinition, input, providerFactory, options.debug)
}

export * from "./types"
