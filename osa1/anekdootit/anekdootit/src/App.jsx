import { useState } from 'react'


const Header = (props) => {
  return <h1>{props.header}</h1>;
};

const App = () => {
  const header1='Anecdote of the day'
  const header2='Anecdote with most votes'
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const generateRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  console.log('anekdootin indeksi on', selected, 'ja tilasto on', votes)
  const addVote = () => {
    const copy = [...votes];
    copy[selected] += 1; // fixed the index to match the selected anecdote
    setVotes(copy);
  };

  const maxVotesIndex = votes.indexOf(Math.max(...votes));
  return (
<div>
      <Header header={header1} />
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={generateRandomAnecdote}>Next Anecdote</button>
      <button onClick={addVote}>Vote</button>

      <Header header={header2} />
      {maxVotesIndex !== -1 && (
        <>
          <p>{anecdotes[maxVotesIndex]}</p>
          <p>has {votes[maxVotesIndex]} votes</p>
        </>
      )}
    </div>
  )
}

export default App