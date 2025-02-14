import { runAgent, runAgentWithApproval } from './agent'
import { chatWithMemory } from './chatMemory'
import { runOneOffLLM } from './llm'

type ProgramTypes = 'chat' | 'one-off' | 'agent' | 'agent-approval'

export const run = (type: ProgramTypes) => {
  switch (type) {
    case 'one-off':
      runOneOffLLM()
      break
    case 'chat':
      chatWithMemory()
      break
    case 'agent':
      runAgent()
      break
    case 'agent-approval':
      runAgentWithApproval()
      break
    default:
      console.error('Invalid programType type')
      process.exit(1)
  }
}
