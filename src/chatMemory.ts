import { JSONFilePreset } from 'lowdb/node'
import type { ChatCompletionAssistantMessageParam, ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { v4 as uuidv4 } from 'uuid'
import { getUserMessageFormCLI } from './getUserMessage'
import { runLLM } from './llm'

export type MessageWithMetadata = ChatCompletionMessageParam & {
  id: string
  createdAt: string
}

export const createMessageWithMetadata = (message: ChatCompletionMessageParam): MessageWithMetadata => ({
  ...message,
  id: uuidv4(),
  createdAt: new Date().toISOString(),
})

export const stripMessageMetadata = (message: MessageWithMetadata): ChatCompletionMessageParam => {
  const { id, createdAt, ...messageWithoutMetadata } = message
  return messageWithoutMetadata
}

type DatabaseType = {
  messages: MessageWithMetadata[]
}

const defaultDatabase: DatabaseType = { messages: [] }

export const getDb = async () => {
  const db = await JSONFilePreset<DatabaseType>('db.json', defaultDatabase)
  return db
}

export const addMessagesToDb = async (messages: ChatCompletionMessageParam[]) => {
  const db = await getDb()
  // must modify the db.data object directly
  db.data.messages.push(...messages.map(createMessageWithMetadata))
  await db.write()
}

export const getMessagesFromDb = async () => {
  const db = await getDb()
  return db.data.messages.map(stripMessageMetadata)
}

export const chatWithMemory = async () => {
  const userMessage = getUserMessageFormCLI()
  const messagesInMemory = await getMessagesFromDb()

  const messagesToAI = messagesInMemory.concat(userMessage)
  const messageFromAI = await runLLM({
    messages: messagesToAI,
  })
  const aiMessage: ChatCompletionAssistantMessageParam = { role: 'assistant', content: messageFromAI.content }
  await addMessagesToDb([userMessage, aiMessage])
  return messageFromAI
}
