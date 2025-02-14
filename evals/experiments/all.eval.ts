import { runLLM } from '../../src/llm'
import { dadJokeTool, generateImageTool, redditTool } from '../../src/tools'
import { runEval } from '../evalTool'
import { createToolCallMessage, ToolCallMatch } from '../scorers'

const allTools = [dadJokeTool, generateImageTool, redditTool]

runEval('allTools', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    }),
  data: [
    {
      input: 'Tell me a funny dad joke',
      expected: createToolCallMessage(dadJokeTool.function.name),
    },
    {
      input: 'take a photo of mars',
      expected: createToolCallMessage(generateImageTool.function.name),
    },
    {
      input: 'what is the most upvoted post on reddit',
      expected: createToolCallMessage(redditTool.function.name),
    },
  ],
  scorers: [ToolCallMatch],
})
