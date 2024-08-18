import { AiDAG, AiDAGType } from "../src"

const dagDefinition: AiDAGType = {
  nodes: {
    summarize_en: {
      id: "summarize_en",
      params: {
        prompt: "Summarize the following English text:",
        model: "gpt-4",
      },
      children: ["combine_summaries"],
    },
    summarize_fr: {
      id: "summarize_fr",
      params: {
        prompt: "Summarize the following text in French:",
        model: "gpt-4o",
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
