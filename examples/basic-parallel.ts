import { executeWorkflow, AiDAGType } from "../src"

const dagDefinition: AiDAGType = {
  nodes: {
    summarize: {
      id: "summarize",
      params: {
        prompt: "Summarize the following text in 10 words:",
        model: "gpt-4o",
      },
      children: ["translate_french", "translate_spanish"],
    },
    keyword_extract: {
      id: "keyword_extract",
      params: {
        model: "gpt-4o",
        prompt: "Extract 5 key words from the following text:",
      },
      children: ["elaborate"],
    },
    sentiment_analysis: {
      id: "sentiment_analysis",
      params: {
        model: "gpt-4o",
        prompt: "Analyze the sentiment of the following text:",
      },
      children: [],
    },
    translate_french: {
      id: "translate_french",
      params: {
        model: "gpt-4o",
        prompt: "Translate the following text to French:",
      },
      children: [],
    },
    translate_spanish: {
      id: "translate_spanish",
      params: {
        model: "gpt-4o",
        prompt: "Translate the following text to Spanish:",
      },
      children: [],
    },
    elaborate: {
      id: "elaborate",
      params: {
        model: "gpt-4o",
        prompt: "Elaborate on the following keywords (one sentence each):",
      },
      children: [],
    },
  },
  rootNodes: ["summarize", "keyword_extract", "sentiment_analysis"],
}

const inputText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
`

async function runConcurrentWorkflow() {
  console.time("Workflow Execution Time")
  try {
    const results = await executeWorkflow(dagDefinition, inputText, {
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
  console.timeEnd("Workflow Execution Time")
}

runConcurrentWorkflow()
