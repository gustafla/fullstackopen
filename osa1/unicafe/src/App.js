import { useState } from 'react'

const Button = ({ handleClick, text }) => (<button onClick={handleClick}>{text}</button>)

const StatisticLine = ({ text, value }) => (<tr><th>{text}</th><td>{value}</td></tr>)

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && good === neutral && good === bad) {
    return (<p>No feedback given</p>)
  }

  return (
    <table>
      <tbody>
        <StatisticLine text='Good' value={good} />
        <StatisticLine text='Neutral' value={neutral} />
        <StatisticLine text='Bad' value={bad} />
        <StatisticLine text='Average' value={(good - bad) / (good + neutral + bad)} />
        <StatisticLine text='Positive' value={good / (good + neutral + bad) * 100 + '%'} />
      </tbody>
    </table>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text='Good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='Neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='Bad' />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div >
  )
}

export default App;
