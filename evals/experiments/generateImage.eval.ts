import { runLLM } from '../../src/llm'
import { generateImageTool } from '../../src/tools'
import { runEval } from '../evalTool'
import { createToolCallMessage, ToolCallMatch } from '../scorers'

runEval('generateImage', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [generateImageTool],
    }),
  data: [
    {
      input: 'Generate an image of a sunset',
      expected: createToolCallMessage(generateImageTool.function.name),
    },
    {
      input: 'take a photo of the sunset',
      expected: createToolCallMessage(generateImageTool.function.name),
    },
  ],
  scorers: [ToolCallMatch],
})
