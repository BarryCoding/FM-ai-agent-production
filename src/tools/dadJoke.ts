import { zodFunction } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

export const dadJoke = async ({}) => {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  })
  return 'a dad joke from dadJoke: ' + (await res.json()).joke
}

export const dadJokeTool = zodFunction({
  name: 'dad_joke',
  parameters: z.object({}),
  description: 'get a new dad joke',
})
