import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAnecdote, addAnecdote } from './reducers/anecdoteReducer';

const App = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const feedback = useSelector((state) => state.feedback);
  const dispatch = useDispatch();

  const handleVote = (id) => {
    dispatch(voteForAnecdote(id));
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    dispatch(addAnecdote(content));
    event.target.anecdote.value = '';
  };

  const handleGood = () => dispatch({ type: 'GOOD' });
  const handleOk = () => dispatch({ type: 'OK' });
  const handleBad = () => dispatch({ type: 'BAD' });
  const handleReset = () => dispatch({ type: 'ZERO' });

  return (
    <div>
      <h1>Anecdotes</h1>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>Create New</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">Create</button>
      </form>

      <h1>Give Feedback</h1>
      <button onClick={handleGood}>good</button>
      <button onClick={handleOk}>ok</button>
      <button onClick={handleBad}>bad</button>
      <button onClick={handleReset}>reset stats</button>
      <h2>Statistics</h2>
      <div>good {feedback.good}</div>
      <div>ok {feedback.ok}</div>
      <div>bad {feedback.bad}</div>
    </div>
  );
};

export default App;
