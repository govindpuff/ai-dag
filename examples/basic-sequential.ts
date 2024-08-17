import dotenv from "dotenv"
import { AiDAG, AiDAGType } from "../src"

dotenv.config()

const dagDefinition: AiDAGType = {
  nodes: {
    summarize: {
      id: "summarize",
      params: {
        prompt: "Summarize the following text in less than 8 words:",
        model: "gpt-4o",
      },
      children: ["translate"],
    },
    translate: {
      id: "translate",
      params: {
        prompt: "Translate the following text to French:",
        model: "gpt-4o-mini",
      },
      children: [],
    },
  },
  rootNodes: ["summarize"],
}

const inputText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
`

async function runWorkflow() {
  try {
    const results = await AiDAG.executeWorkflow(dagDefinition, inputText, {
      debug: true,
    })

    console.log("Workflow Results:")
    for (const result of results) {
      console.log(`Node: ${result.nodeId}`)
      console.log(`Result: ${result.result}`)
      console.log("---")
    }
  } catch (error) {
    console.error("Error executing workflow:", error)
  }
}

runWorkflow()
