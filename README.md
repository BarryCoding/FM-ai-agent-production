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