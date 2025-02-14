import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
  ChatCompletionUserMessageParam,
} from 'openai/resources/index.mjs'
import { z } from 'zod'
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

export const runLLMApproval = async (userMessage: ChatCompletionUserMessageParam) => {
  // structured output
  const result = await myAI.beta.chat.completions.parse({
    model: CHEAP_MODEL,
    temperature: LOW_TEMPERATURE,
    response_format: zodResponseFormat(
      z.object({
        approved: z.boolean().describe('did the user approve the action or not'),
      }),
      'approval'
    ),
    messages: [
      {
        role: 'system',
        content: `Determine if the user approved the image generation. If you are not sure, then it is not approved.`,
      },
      userMessage,
    ],
  })

  return result.choices[0].message.parsed?.approved
}
