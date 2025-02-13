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