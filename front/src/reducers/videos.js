/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import update from 'react-addons-update';
import { 
  GET_VIDEO_LIST,
  IS_LOADING_VIDEOS
} from './types';

// The initial state of the App
export const initialState = {
    videos: [],
    isLoading: false
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_VIDEO_LIST:
        //return{ ...state, data: action.payload.data}
        return update(state, {
          videos: { $set: action.payload.videos },
        });
        break;
      case IS_LOADING_VIDEOS:
        return update(state, {
          isLoading: { $set: action.payload.isLoading },
        });
        break;
    }
    return state;
  };

export default reducer;
