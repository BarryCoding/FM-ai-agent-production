import { runLLM } from '../../src/llm'
import { dadJokeTool } from '../../src/tools'
import { runEval } from '../evalTool'
import { createToolCallMessage, ToolCallMatch } from '../scorers'

runEval('dadJoke', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [dadJokeTool],
    }),
  data: [
    {
      input: 'Tell me a funny dad joke',
      expected: createToolCallMessage(dadJokeTool.function.name),
    },
  ],
  scorers: [ToolCallMatch],
})
