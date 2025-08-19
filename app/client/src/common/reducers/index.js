import { combineReducers } from 'redux';
import { todos } from './todos';
import { auth } from './auth';

const appReducers = combineReducers({
	todos,
	auth,
});

export default appReducers;
