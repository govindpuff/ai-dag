# AIDAG - AI-Driven Directed Acyclic Graph Executor

AIDAG is a TypeScript library for executing AI-driven workflows defined as Directed Acyclic Graphs (DAGs). It supports various node types, including AI text generation and HTTP requests, allowing for complex, multi-step AI workflows.

## Features

- Define workflows as Directed Acyclic Graphs (DAGs)
- Support for AI nodes (using OpenAI's GPT models)
- Support for HTTP request nodes
- Extensible architecture for adding new node types
- Asynchronous execution of workflows

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/aidag.git
cd aidag
npm install
```

## Usage

### Define a Workflow

Create a JSON file that defines your workflow. Here's an example of a simple workflow that fetches a dad joke and translates it to French:

```json
{
  "nodes": {
    "fetchJoke": {
      "id": "fetchJoke",
      "type": "HTTP",
      "params": {
        "url": "https://icanhazdadjoke.com",
        "method": "GET",
        "outputPath": "joke",
        "headers": {
          "Accept": "application/json"
        }
      },
      "children": ["translateJoke"]
    },
    "translateJoke": {
      "id": "translateJoke",
      "type": "AI",
      "params": {
        "prompt": "Translate the following joke to French:\n\n{input}\n\nFrench translation:",
        "model": "gpt-3.5-turbo",
        "temperature": 0.7,
        "max_tokens": 200
      },
      "children": []
    }
  },
  "rootNodes": ["fetchJoke"]
}
```

### Run the Workflow

To run a workflow, use the `executeWorkflow` function. You can create a script like `examples/runner.ts` to execute your workflows:

```typescript
import { executeWorkflow } from "../src/index"
import fs from "fs"

const runWorkflow = async (filePath: string) => {
  const workflowJson = fs.readFileSync(filePath, "utf-8")
  const workflow = JSON.parse(workflowJson)

  const result = await executeWorkflow(workflow, "", { debug: true })
  console.log(JSON.stringify(result, null, 2))
}

const filePath = process.argv[2]
if (!filePath) {
  console.error("Please provide a workflow JSON file path")
  process.exit(1)
}

runWorkflow(filePath).catch(console.error)
```

Then, you can run your workflow using `ts-node`:

```bash
npx ts-node examples/runner.ts examples/dad-joke-translation.json
```

Make sure to set the `OPENAI_API_KEY` environment variable with your OpenAI API key before running the script.

## Extending AIDAG

### Adding New Node Types

To add a new node type:

1. Create a new class that implements the `DAGNode` interface in `src/nodes/`.
2. Implement the `execute` method for the new node type.
3. Add a new case in the `DAGNodeFactory` to handle the new node type.
4. Update the `types.ts` file to include any new interfaces or types needed for the new node.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
