interface Score {
  name: string
  score: number
}
interface Run {
  input: string
  output: {
    role: string
    content: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tool_calls?: any[]
    refusal: null
  }
  expected: string
  scores: Score[]
  createdAt: string
}
interface Set {
  runs: Run[]
  score: number
  createdAt: string
}
export interface Experiment {
  name: string
  sets: Set[]
}
