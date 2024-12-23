import { combineReducers } from 'redux';
import anecdoteReducer from './anecdoteReducer';
import feedbackReducer from './feedbackReducer';

const rootReducer = combineReducers({
  anecdotes: anecdoteReducer,
  feedback: feedbackReducer,
});

export default rootReducer;
