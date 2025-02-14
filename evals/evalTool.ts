import chalk from 'chalk'
import { JSONFilePreset } from 'lowdb/node'
import type { Experiment, Result, Run, RunEvalOptions } from './type'

const defaultResult: Result = {
  experiments: [],
}

const getResultsDb = async () => {
  const resultsDb = await JSONFilePreset<Result>('results.json', defaultResult)
  return resultsDb
}

export const loadExperiment = async (experimentName: string): Promise<Experiment | undefined> => {
  const resultsDb = await getResultsDb()
  return resultsDb.data.experiments.find((e) => e.name === experimentName)
}

const calculateAvgScore = (runs: Run[]) => {
  const totalScores = runs.reduce((sum, run) => {
    const runAvg = run.scores.reduce((sum, score) => sum + (score.score ?? 0), 0) / run.scores.length
    return sum + runAvg
  }, 0)
  return totalScores / runs.length
}

export const saveSet = async (experimentName: string, runs: Run[]) => {
  const runsWithTimestamp = runs.map((run) => ({
    ...run,
    createdAt: new Date().toISOString(),
  }))
  const newSet = {
    runs: runsWithTimestamp,
    score: calculateAvgScore(runsWithTimestamp),
    createdAt: new Date().toISOString(),
  }

  const resultsDb = await getResultsDb()
  const existingExperiment = resultsDb.data.experiments.find((e) => e.name === experimentName)
  if (existingExperiment) {
    existingExperiment.sets.push(newSet)
  } else {
    resultsDb.data.experiments.push({
      name: experimentName,
      sets: [newSet],
    })
  }

  await resultsDb.write()
}

export const runEval = async <T>(experiment: string, { task, data, scorers }: RunEvalOptions<T>) => {
  const results = await Promise.all(
    data.map(async ({ input, expected }) => {
      const output = await task(input)
      const scores = await Promise.all(
        scorers.map(async (scorer) => {
          const score = await scorer({ input, output, expected })
          return {
            name: score.name,
            score: score.score,
          }
        })
      )
      const result = { input, output, expected, scores }
      return result
    })
  )

  const previousExperiment = await loadExperiment(experiment)
  const previousScore = previousExperiment?.sets[previousExperiment.sets.length - 1]?.score || 0
  const currentScore = calculateAvgScore(results)
  const scoreDiff = currentScore - previousScore
  const color = previousExperiment ? (scoreDiff > 0 ? chalk.green : scoreDiff < 0 ? chalk.red : chalk.blue) : chalk.blue
  console.log(`Previous score: ${color(previousScore.toFixed(2))}`)
  console.log(`Current score: ${color(currentScore.toFixed(2))}`)
  console.log(`Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}`)

  await saveSet(experiment, results)
  return results
}
