import { addMessagesToDb, getMessagesFromDb } from './chatMemory'
import { getUserMessageFormCLI } from './getUserMessage'
import { runLLM, runLLMApproval } from './llm'
import { logMessage, showLoader } from './ui'

import type { ChatCompletionMessage, ChatCompletionUserMessageParam } from 'openai/resources/index.mjs'
import { initialTools, runTool } from './toolRunner'
import { generateImageTool } from './tools'

export const runAgent = async () => {
  const userMessage = getUserMessageFormCLI()
  await addMessagesToDb([userMessage])

  const loader = showLoader('🤖 Thinking...')

  // FIXME: race condition
  // loop until the message is not a tool call
  while (true) {
    const messagesInMemory = await getMessagesFromDb()
    console.log(`🔎 🔍 ~ runAgent ~ messagesInMemory:`, messagesInMemory)
    const messageFromAI = await runLLM({
      messages: [...messagesInMemory, userMessage],
      tools: initialTools,
    })

    await addMessagesToDb([messageFromAI])
    logMessage(messageFromAI)

    // if the message is not a tool call,
    // stop loop here
    if (messageFromAI.content) {
      loader.stop()
      return
    }

    // if the message is a tool call, run the tool and add the result to the chat
    // and continue the loop
    if (messageFromAI.tool_calls) {
      const toolCall = messageFromAI.tool_calls[0]
      loader.update(`executing: ${toolCall.function.name}`)
      const toolContent = await runTool(toolCall)
      const toolMessage = {
        role: 'tool',
        content: toolContent,
        tool_call_id: toolCall.id,
      } as const
      await addMessagesToDb([toolMessage])
      loader.update(`done: ${toolCall.function.name}`)
    }
  }
}

const handleImageApprovalFlow = async (userMessage: ChatCompletionUserMessageParam) => {
  const history = await getMessagesFromDb()
  const lastMessage = history.at(-1) as ChatCompletionMessage
  const toolCall = lastMessage?.tool_calls?.[0]

  if (!toolCall || toolCall.function.name !== generateImageTool.function.name) {
    return
  }

  const loader = showLoader('Processing generateImage approval...')
  const approved = await runLLMApproval(userMessage)

  if (approved) {
    loader.update(`executing generateImage tool: ${toolCall.function.name}`)
    const toolContent = await runTool(toolCall)

    loader.update(`done generateImage: ${toolCall.function.name}`)
    const toolMessage = {
      role: 'tool',
      content: toolContent,
      tool_call_id: toolCall.id,
    } as const
    await addMessagesToDb([toolMessage])
  } else {
    const toolMessage = {
      role: 'tool',
      content: 'User did not approve image generation at this time.',
      tool_call_id: toolCall.id,
    } as const
    await addMessagesToDb([toolMessage])
  }

  loader.stop()
  return true
}

export const runAgentWithApproval = async () => {
  const userMessage = getUserMessageFormCLI()
  const approved = await handleImageApprovalFlow(userMessage)

  // if the user did not approve the image generation,
  // add the user message to the chat
  if (!approved) await addMessagesToDb([userMessage])

  const loader = showLoader('🤖 Thinking...')

  while (true) {
    const messagesInMemory = await getMessagesFromDb()
    const messageFromAI = await runLLM({
      messages: [...messagesInMemory, userMessage],
      tools: initialTools,
    })

    await addMessagesToDb([messageFromAI])
    logMessage(messageFromAI)

    if (messageFromAI.content) {
      loader.stop()
      return
    }

    if (messageFromAI.tool_calls) {
      const toolCall = messageFromAI.tool_calls[0]
      loader.update(`executing: ${toolCall.function.name}`)

      if (toolCall.function.name === generateImageTool.function.name) {
        loader.update('need user approval')
        loader.stop()
        return
        // bun start yes or bun start no
      }

      const toolContent = await runTool(toolCall)
      const toolMessage = {
        role: 'tool',
        content: toolContent,
        tool_call_id: toolCall.id,
      } as const
      await addMessagesToDb([toolMessage])
      loader.update(`done: ${toolCall.function.name}`)
    }
  }
}
