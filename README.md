# my-agent-production

## inherit from my-agent-scratch

```bash
# clone the repo without git
bunx degit git@github.com:BarryCoding/FM-ai-agent-scratch.git 

git init
touch .env
```

- inherit from [my-agent-scratch](https://github.com/BarryCoding/FM-ai-agent-scratch)
- update current package `name`
- update .gitignore with `db.json` and `results.json`
- update README.md
- go to [your OpenAI dashboard](https://platform.openai.com/settings/organization/api-keys) and get/create your API key
  - follow the .env.example to add your API key in your .env file(stay safe)

## experiment viewer

```bash
bun create vite@latest # experiment-viewer -> React -> Typescript

cd experiment-viewer
# in the experiment-viewer folder
bun install
bun run dev
```

- for more about experiment viewer project, check its own README.md
- make this frontend to be a sub repo of this repo
- `bun view`

## evals

- Add eval runner `evals/run.ts` for dynamic evals execution
- Create sample eval test file `evals/experiments/test.eval.ts`
- Add eval command to npm scripts
  - package.json script `"eval": "bun evals/run.ts"`

```bash
bun eval      # 🔴 error with no eval name
bun eval lol  # 🔴 error with no such file
bun eval test # ✅
```

### eval tool

- Add autoevals dependency
  - `bun add autoevals`
- Add evaluation tool `evals/evalTool.ts` with experiment tracking and scoring system
  - Add TypeScript types `evals/type.ts` for evaluation system 
  - Implement persistent storage using lowdb
  - Include score comparison with visual feedback in the terminal

### eval score

- Implement ToolCallMatch scorer for validating tool usage
  - evals/scorers.ts

### eval examples

- Added new evaluation test files:
  - dadJoke.eval.ts : Tests dad joke tool functionality
  - generateImage.eval.ts : Tests image generation with different prompts
  - Modified reddit.eval.ts : Removed redundant test case
  - all.eval.ts : Tests all tools together with different scenarios

- Optimized tool descriptions base on evaluation results:
  - dadJoke.ts : Clarified description
  - generateImage.ts : Enhanced description to include photo taking capability
  - reddit.ts : Made description more generic for Reddit posts

```bash
bun eval reddit
bun eval dadJoke  
bun eval generateImage
bun eval all
```

## RAG

### Ingest movie data

- login to upstash dashboard -> Vector tab -> create index
   1. name: agent-prod, region: Ireland, embeddingModel: mixedbread, others: default
   2. agent-prod details -> Connect .env (Copy Paste) 

- Add dependencies: @upstash/vector and csv-parse
  - `bun add @upstash/vector csv-parse`
- Add movie data ingestion script `ingest.ts` using Upstash vector database
  - Prepare IMDB movie dataset
  - Read and Parse IMDB movie dataset from CSV
  - Store movie metadata and generate embeddings
  - Add visual progress feedback for ingestion process
  - Run script `bun ingest`

### movie search

- Add RAG-based movie query `query.ts` functionality
  - Implement vector database querying system
- Create movie search tool `movieSearch.ts` with filtering capabilities
  - Integrate movie search into tools framework

```bash
rm db.json
bun start "find me a scary movie about a vampire"
```

## Agent with Approval

- runLLMApproval
  - Implement **structured output** validation using Zod
  - Add approval check function for user messages
  - Use boolean response format for clear approval status