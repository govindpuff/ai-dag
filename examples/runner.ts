import fs from "fs"
import path from "path"
import { AiDAGType, executeWorkflow } from "../src"

const INPUT = `
Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
`

async function run() {
  const filename = process.argv[2]

  if (!filename) {
    console.error("Please provide a JSON filename as an argument.")
    process.exit(1)
  }

  console.time("Workflow Execution Time")
  try {
    const filePath = path.resolve(process.cwd(), filename)
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const dagDefinition: AiDAGType = JSON.parse(fileContent)

    const results = await executeWorkflow(dagDefinition, INPUT, {
      debug: false,
    })

    console.log("Workflow Results:")
    console.log(JSON.stringify(results, null, 2))
  } catch (error) {
    console.error("Error executing workflow:", error)
  }
  console.timeEnd("Workflow Execution Time")
}

run()
