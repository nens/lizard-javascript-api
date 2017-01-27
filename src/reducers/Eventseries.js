import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {};

export default (state = defaultState, action) => {

  let newState = { ...state };

  switch (action.type) {
    case ActionTypes.ADD_EVENTSERIES_SYNC:
      newState.error = false;
      newState[action.uuid] = {};
      return newState;
    case ActionTypes.RECEIVE_EVENTSERIES_SUCCESS:
      newState.error = false;
      newState[action.uuid] = action.data;
      return newState;
    case ActionTypes.RECEIVE_EVENTSERIES_FAILURE:
      newState.error = action.error;
      return newState;
    case ActionTypes.REMOVE_EVENTSERIES:
      delete newState[action.uuid];
      return newState;
    default:
      return state;
  }
};
