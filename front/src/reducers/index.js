/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';

import searchQueryReducer from './searchQuery';
import videoReducer from './videos';
import authReducer from './auth';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    searchQuery: searchQueryReducer,
    videos: videoReducer,
    auth: authReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
