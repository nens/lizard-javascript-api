import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers/index';

let createStoreWithMiddleware;

createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

/**
 * Consumer applications may call createStore({}initialState, {}ownReducers) to
 * create a store with Lizard state and application specific state.
 */
export default function configureStore(
  initialState = {},
  externalReducers = {}
) {

  const rootReducer = combineReducers({...reducers, ...externalReducers});

  return createStoreWithMiddleware(rootReducer, initialState);
}
