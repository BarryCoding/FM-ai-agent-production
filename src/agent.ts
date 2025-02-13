import { addMessagesToDb, getMessagesFromDb } from './chatMemory'
import { getUserMessageFormCLI } from './getUserMessage'
import { runLLM } from './llm'
import { logMessage, showLoader } from './ui'

import { initialTools, runTool } from './toolRunner'

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
