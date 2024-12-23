import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteForAnecdote, addAnecdote } from './reducers/anecdoteReducer';

const App = () => {
  const anecdotes = useSelector((state) => state);
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

  return (
    <div>
      <h2>Anecdotes</h2>
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
    </div>
  );
};

export default App;
