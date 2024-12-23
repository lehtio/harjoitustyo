const initialState = [
  {
    content: 'If it hurts, do it more often',
    id: '1',
    votes: 0
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: '2',
    votes: 0
  }
];

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.payload.id;
      const anecdoteToChange = state.find(anecdote => anecdote.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      };
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote
      );
    }
    case 'ADD_ANECDOTE': {
      return [...state, action.payload];
    }
    default:
      return state;
  }
};

export const voteForAnecdote = (id) => {
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
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    }
  };
};

export default anecdoteReducer;
