import { Index as UpstashIndex } from '@upstash/vector'
import { parse } from 'csv-parse/sync'
import fs from 'node:fs'
import path from 'node:path'
import ora from 'ora'

const index = new UpstashIndex()

const indexMovieData = async () => {
  const spinner = ora('📖 Reading movie data...').start()

  // https://github.com/Hendrixer/agents-production/blob/step/3/src/rag/imdb_movie_dataset.csv
  const moviesPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv')
  const csvData = fs.readFileSync(moviesPath, 'utf-8')
  const records = parse(csvData, { columns: true, skip_empty_lines: true })

  spinner.text = '🟢 Starting movie indexing...'

  for (const record of records) {
    spinner.text = `🟩 Indexing movie ${record.Title}...`

    try {
      await index.upsert({
        id: record.Title,
        data: `${record.Title}. ${record.Genre}. ${record.Description}.`, // automatically embedded
        metadata: {
          title: record.Title,
          year: Number(record.Year),
          genre: record.Genre,
          director: record.Director,
          actors: record.Actors,
          rating: Number(record.Rating),
          votes: Number(record.Votes),
          revenue: Number(record.Revenue),
          metascore: Number(record.Metascore),
        },
      })
    } catch (e) {
      spinner.fail(`🔴 Error indexing movie ${record.Title}`)
      console.error(e)
    }
  }

  spinner.succeed('✅ Finished indexing all movie data!')
}

// only run once
indexMovieData()
