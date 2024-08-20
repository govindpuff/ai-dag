import fs from "fs"
import path from "path"
import { AiDAGType, executeWorkflow } from "../src"

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
    const definition: AiDAGType = JSON.parse(fileContent)

    const results = await executeWorkflow({
      definition,
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
