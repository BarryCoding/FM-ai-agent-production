import type { Scorer } from 'autoevals'

export const createToolCallMessage = (toolName: string) => ({
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: {
        name: toolName,
      },
    },
  ],
})

// REFACTOR: not type safe
export const ToolCallMatch: Scorer<any, {}> = async ({ output, expected }) => {
  const score =
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function?.name === expected.tool_calls[0].function?.name
      ? 1
      : 0

  return { name: 'ToolCallMatch', score }
}
