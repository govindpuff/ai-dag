import { executeDAG } from "./dag"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, DAGExecutionResult } from "./types"

export const executeWorkflow = async (
  dagDefinition: AiDAGType,
  input: string,
  options: { debug?: boolean } = {}
): Promise<DAGExecutionResult> => {
  const providerFactory = (model: string) => createOpenAIProvider()
  return executeDAG(dagDefinition, input, providerFactory, options.debug)
}

export * from "./types"
