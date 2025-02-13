import { useState } from 'react'
import resultsData from '../../results.json'
import './App.css'
import { ExperimentGraph } from './components/ExperimentGraph'

const App = () => {
  const results = resultsData as Results
  const experiments = results.experiments
  const [selectedExperiment, setSelectedExperiment] = useState(experiments[0].name)
  const currentExperiment = experiments.find((exp) => exp.name === selectedExperiment)
  const limitedExperiment = currentExperiment
    ? {
        ...currentExperiment,
        sets: currentExperiment.sets.slice(-10), // Limit to last 10 sets
      }
    : null

  return (
    <div className='app'>
      <h1>Experiment Results Viewer</h1>
      <div className='controls'>
        <label htmlFor='experiment-select'>Select Experiment: </label>
        <select
          id='experiment-select'
          value={selectedExperiment}
          onChange={(e) => setSelectedExperiment(e.target.value)}
        >
          {experiments.map((exp) => (
            <option key={exp.name} value={exp.name}>
              {exp.name}
            </option>
          ))}
        </select>
      </div>
      {limitedExperiment && <ExperimentGraph experiment={limitedExperiment} />}
    </div>
  )
}

export default App
