import { zodFunction } from 'openai/helpers/zod.mjs'
import { z } from 'zod'
import { myAI } from '../openai'

export const generateImage = async ({ prompt }: { prompt: string }) => {
  const response = await myAI.images.generate({
    model: 'dall-e-2', // Why so expensive!
    prompt,
    n: 1,
    size: '512x512',
  })

  return response.data[0].url!
}

export const generateImageTool = zodFunction({
  name: 'generate_image',
  parameters: z.object({
    prompt: z
      .string()
      .describe(
        `prompt for the image. Be sure to consider the user's original message when making the prompt. If you are unsure, then as the user to provide more details.`
      ),
  }),
  description: 'generate an image',
})
