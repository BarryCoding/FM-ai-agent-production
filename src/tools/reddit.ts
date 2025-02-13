import { zodFunction } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

export const reddit = async ({}) => {
  const { data } = await fetch('https://www.reddit.com/r/nba/.json').then((res) => res.json())
  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))
  const top10 = relevantInfo.length <= 10 ? relevantInfo : relevantInfo.slice(0, 10)

  return JSON.stringify(top10, null, 2)
}

export const redditTool = zodFunction({
  name: 'reddit',
  parameters: z.object({}),
  description: 'get the latest top 10 NBA posts from Reddit',
})
