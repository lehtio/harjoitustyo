import { useDispatch } from 'react-redux';
import { addAnecdote } from './reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = ''; // Tyhjennetään kenttä
    dispatch(addAnecdote(content));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new</h2>
      <input name="anecdote" />
      <button type="submit">add</button>
    </form>
  );
};

export default AnecdoteForm;
