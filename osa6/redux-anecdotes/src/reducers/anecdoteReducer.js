const anecdotesAtStart = [
  'Kissa istuu',
  'Koira haukkuu',
  'Kettu kiertää',
  'Karhu nukkuu',
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.payload.id;
      const anecdoteToVote = state.find((a) => a.id === id);
      const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 };
      return state.map((a) => (a.id !== id ? a : updatedAnecdote));
    }
    case 'ADD_ANECDOTE': {
      const newAnecdote = action.payload;
      return [...state, newAnecdote];
    }
    default:
      return state;
  }
};

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  };
};

export const addAnecdote = (content) => {
  return {
    type: 'ADD_ANECDOTE',
    payload: {
      content,
      id: getId(),
      votes: 0
    }
  };
};

export default anecdoteReducer;

