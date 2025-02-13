import type { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs'

// bun start "userContent"
export const getUserMessageFormCLI = (): ChatCompletionUserMessageParam => {
  const userContent = process.argv[2]
  if (!userContent) {
    console.error('Please provide a message')
    process.exit(1)
  }
  return { role: 'user', content: userContent }
}
