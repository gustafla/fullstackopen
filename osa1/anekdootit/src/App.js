import { useState } from 'react'

const Anecdote = ({ anecdote }) => {
  const { text, votes } = anecdote

  return (
    <div>
      <p>{text}</p>
      <p>Has {votes} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(7).fill(0))

  const randomIndex = () => {
    let value
    do {
      value = Math.floor(Math.random() * anecdotes.length)
    } while (value === selected)
    console.log(value)
    return value
  }

  const voteUp = () => {
    var newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const mostVotes = () => {
    let mostIndex = 0
    for (let i = 0; i < anecdotes.length; i += 1) {
      if (votes[i] > votes[mostIndex]) {
        mostIndex = i
      }
    }

    return {
      text: anecdotes[mostIndex],
      votes: votes[mostIndex]
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={{ text: anecdotes[selected], votes: votes[selected] }} />
      <button onClick={() => setSelected(randomIndex())}>Next anecdote</button>
      <button onClick={() => voteUp()}>Vote</button>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={mostVotes()} />
    </div >
  )
}

export default App
