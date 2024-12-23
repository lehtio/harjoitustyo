const initialState = [
  { content: 'If it hurts, do it more often', id: '1', votes: 0 },
  { content: 'Adding manpower to a late software project makes it later!', id: '2', votes: 0 },
];

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE':
      return state.map((anecdote) =>
        anecdote.id === action.payload.id
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      );
    case 'ADD_ANECDOTE':
      return [
        ...state,
        { content: action.payload.content, id: action.payload.id, votes: 0 },
      ];
    default:
      return state;
  }
};

export const voteForAnecdote = (id) => ({
  type: 'VOTE',
  payload: { id },
});

export const addAnecdote = (content) => ({
  type: 'ADD_ANECDOTE',
  payload: { content, id: (100000 * Math.random()).toFixed(0) },
});

export default anecdoteReducer;
