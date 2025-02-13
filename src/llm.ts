import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/index.mjs'
import { getUserMessageFormCLI } from './getUserMessage'
import { myAI } from './openai'
import { systemMessage } from './systemPrompt'

const CHEAP_MODEL = 'gpt-4o-mini' // cheap model
const LOW_TEMPERATURE = 0.1 // stable output

export const runLLM = async ({
  model = CHEAP_MODEL,
  messages,
  temperature = LOW_TEMPERATURE,
  tools = [],
}: {
  model?: string
  messages: ChatCompletionMessageParam[]
  temperature?: number
  tools?: ChatCompletionTool[]
}) => {
  const response = await myAI.chat.completions.create({
    model,
    messages: [systemMessage, ...messages],
    temperature,
    tools,
    parallel_tool_calls: false,
  })

  return response.choices[0].message
}

export const runOneOffLLM = async () => {
  const userMessage = getUserMessageFormCLI()
  const response = await runLLM({ messages: [userMessage] })
  console.log(response)
}
