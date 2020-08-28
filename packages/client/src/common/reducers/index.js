import { combineReducers } from 'redux';
import { todos } from './todos';

const appReducers = combineReducers({
	todos,
});

export default appReducers;
