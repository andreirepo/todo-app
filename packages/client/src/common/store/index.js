import { createStore, applyMiddleware } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const initialState = {};

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const configureStore = () =>
	createStore(
		persistedReducer,
		initialState,
		composeWithDevTools(applyMiddleware(thunk))
	);
