import type OpenAI from 'openai'
import { zodFunction } from 'openai/helpers/zod'
import { z } from 'zod'
import { dadJoke, dadJokeTool, generateImage, generateImageTool, reddit, redditTool } from './tools'

// can be anything from APIs, other agent response, etc.
const getWeather = (...args: any[]) => 'very cold. 17deg in Makati'

const GetWeatherParameters = z.object({
  location: z.string().describe('City and country e.g. Bogotá, Colombia, Makati'),
})
const weatherTool = zodFunction({
  name: 'getWeather',
  description: 'Retrieves current weather for the given location.',
  parameters: GetWeatherParameters,
})

export const initialTools = [weatherTool, dadJokeTool, redditTool, generateImageTool]

export const runTool = async (messageToolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall) => {
  // input toolArgs types not safe!!!
  const input = {
    toolArgs: JSON.parse(messageToolCall.function.arguments ?? '{}'),
    otherParams: 'it can be anything or user prompts',
  }
  switch (messageToolCall.function.name) {
    case weatherTool.function.name:
      return getWeather(input)
    // Real Tools
    case dadJokeTool.function.name:
      return dadJoke({})
    case redditTool.function.name:
      return reddit({})
    case generateImageTool.function.name:
      return generateImage({ prompt: input.toolArgs.prompt })
    default:
      return `Never run this tool: ${messageToolCall.function.name} again, or else!`
  }
}
