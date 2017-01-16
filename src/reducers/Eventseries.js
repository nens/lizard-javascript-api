import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {};
let newState = {};

export default function (state = defaultState, action) {

  switch (action.type) {
    case ActionTypes.ADD_EVENTSERIES:
      newState = {...state};
      newState[action.uuid] = {};
      return newState;
    case ActionTypes.RECEIVE_EVENTSERIES:
      newState = {...state};
      newState[action.uuid] = action[action.uuid];
      return newState;
    case ActionTypes.REMOVE_EVENTSERIES:
      newState = {...state};
      delete newState[action.uuid];
      return newState;
    default:
      return state;
  }
};
