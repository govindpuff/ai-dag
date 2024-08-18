import { executeDAG } from "./dag"
import { createOpenAIProvider } from "./providers/openai"
import { AiDAGType, DAGExecutionResult } from "./types"

export const executeWorkflow = async (
  dagDefinition: AiDAGType,
  input: string,
  options: { debug: boolean; apiKey?: string } = { debug: false }
): Promise<DAGExecutionResult> => {
  const providerFactory = (model: string) =>
    createOpenAIProvider(options.apiKey)
  return executeDAG(dagDefinition, input, providerFactory, options)
}

export * from "./types"
