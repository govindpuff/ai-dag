# ai-dag

`ai-dag` is a TypeScript library for creating AI-powered workflows using Directed Acyclic Graphs (DAGs). It allows you to define complex, multi-step AI processing pipelines with ease, supporting concurrent execution and flexible model selection for each step.

## Features

- Define AI workflows as Directed Acyclic Graphs (DAGs)
- Support for multiple AI providers (currently OpenAI, extensible to others)
- Concurrent execution of independent nodes
- Flexible model selection for each node in the DAG
- Combine outputs from multiple parent nodes
- Debug mode for tracking execution progress

## Usage

Here's a basic example of how to use `ai-dag`:

```typescript
import { AiDAG, AiDAGType } from "ai-dag"
import dotenv from "dotenv"

dotenv.config()

const dagDefinition: AiDAGType = {
  nodes: {
    summarize_en: {
      id: "summarize_en",
      params: {
        prompt: "Summarize the following English text in 10 words:",
        model: "gpt-4",
      },
      children: ["combine_summaries"],
    },
    summarize_fr: {
      id: "summarize_fr",
      params: {
        prompt: "Summarize the following text in French in 10 words:",
        model: "gpt-4",
      },
      children: ["combine_summaries"],
    },
    combine_summaries: {
      id: "combine_summaries",
      params: {
        prompt:
          "Combine the following summaries into a bilingual summary, switching between languages for each alternate word:",
        model: "gpt-4o",
      },
      children: [],
    },
  },
  rootNodes: ["summarize_en", "summarize_fr"],
}

const inputText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
`

async function runWorkflow() {
  try {
    const results = await AiDAG.executeWorkflow(dagDefinition, inputText)
    console.log("Final Workflow Result:", results[results.length - 1].result)
  } catch (error) {
    console.error("Error executing workflow:", error)
  }
}

runWorkflow()
```

This example will output the final result of the workflow, which is the bilingual summary produced by the `combine_summaries` node.

### Using Debug Mode

To enable debug mode and see the execution progress of each node, pass the `debug` option to `executeWorkflow`:

```typescript
const results = await AiDAG.executeWorkflow(dagDefinition, inputText, {
  debug: true,
})
```

With debug mode enabled, you'll see console output like this:

```
Starting job with id summarize_en...
Starting job with id summarize_fr...
Finished job with id summarize_en...
Finished job with id summarize_fr...
Starting job with id combine_summaries...
Finished job with id combine_summaries...
```

This helps you track the execution flow of your DAG, especially useful for complex workflows with many nodes.

## API Reference

### AiDAG.executeWorkflow(dagDefinition, input, options)

Executes a workflow defined by a DAG.

- `dagDefinition`: An object describing the DAG structure.
- `input`: The initial input text for the workflow.
- `options`: An optional object with additional settings (e.g., `{ debug: true }`).

Returns a Promise that resolves to an array of `NodeOutput` objects.

### DAG Definition

A DAG is defined as an object with the following structure:

```typescript
interface AiDAGType {
  nodes: Record<string, Node>
  rootNodes: string[]
}

interface Node {
  id: string
  params: {
    prompt: string
    model: string
    temperature?: number
    max_tokens?: number
  }
  children: string[]
}
```

## Environment Variables

Make sure to set up your `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
