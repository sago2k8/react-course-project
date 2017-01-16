import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';


const logger = store => next => (action) => {
  console.debug('stado actual', store.getState());
  console.debug('action', action);
  const result = next(action);
  console.debug('estado nuevo', store.getState());
  return result;
};

const store = createStore(
  reducer,
  applyMiddleware(
    logger,
    ),
  );

export default store;
