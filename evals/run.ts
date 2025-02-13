import { join } from 'node:path'

const main = async () => {
  const evalName = process.argv[2]
  if (!evalName) {
    console.error('Please provide an eval name')
    process.exit(1)
  }
  try {
    const evalPath = join(import.meta.dir, 'experiments', `${evalName}.eval.ts`)
    await import(evalPath)
  } catch (error) {
    console.error(`Failed to load eval '${evalName}':`, error)
    process.exit(1)
  }
}

main()
