import { Index as UpstashIndex } from '@upstash/vector'

// Initialize Upstash Vector client
const index = new UpstashIndex()

type MovieMetadata = {
  title?: string
  year?: string
  genre?: string
  director?: string
  actors?: string
  rating?: string
  votes?: string
  revenue?: string
  metascore?: string
}

export const queryMovies = async (query: string, filters?: Partial<MovieMetadata>, topK: number = 5) => {
  // Build filter string if filters provided
  let filterStr = ''

  // Query the vector store
  const results = await index.query({
    data: query,
    topK,
    filter: filterStr || undefined,
    includeMetadata: true,
    includeData: true,
  })

  return results
}
