import { runLLM } from '../../src/llm'
import { redditTool } from '../../src/tools'
import { runEval } from '../evalTool'
import { createToolCallMessage, ToolCallMatch } from '../scorers'

runEval('reddit', {
  task: (input: string) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [redditTool],
    }),
  data: [
    {
      input: 'find me something interesting on reddit',
      expected: createToolCallMessage(redditTool.function.name),
    },
    {
      input: 'hi',
      expected: createToolCallMessage(redditTool.function.name),
    },
  ],
  scorers: [ToolCallMatch],
})
