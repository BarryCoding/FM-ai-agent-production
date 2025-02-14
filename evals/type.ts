import type { Score, Scorer } from 'autoevals'

export type Run = {
  input: any
  output: any
  expected: any
  scores: {
    name: Score['name']
    score: Score['score']
  }[]
}
type RunsWithTimestamp = Run & { createdAt: string }
type Set = {
  runs: RunsWithTimestamp[]
  score: number
  createdAt: string
}
export type Experiment = {
  name: string
  sets: Set[]
}

export type Result = {
  experiments: Experiment[]
}

export type RunEvalOptions<T> = {
  task: (input: any) => Promise<T>
  data: { input: any; expected: T }[]
  scorers: Scorer<T, any>[]
}
