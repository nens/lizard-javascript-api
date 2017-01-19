import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import handleReceiveError from '../utils';

let defaultState = {};
let intersection = {};
let newIntersection = {};
let newState = {};

// This function is invoked for updating the intersections part of the redux
// store in response to 3 actions not directly related to intersections:
// REMOVE_RASTER, REMOVE_TIMESERIES and REMOVE_EVENTSERIES
const removeRelatedIntersections = (state, id) => {
  newState = { ...state };
  return pickBy(newState, (intersection) => {
    return intersection.typeId !== id;
  });
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_INTERSECTION_SYNC:
      newState = { ...state };
      newState[action.id] = omit(action, 'id', 'type');
      return newState;
    case ActionTypes.REMOVE_INTERSECTION:
      return omit(state, action.id);
    case ActionTypes.REMOVE_RASTER:
      return removeRelatedIntersections(state, action.id);
    case ActionTypes.REMOVE_TIMESERIES:
      return removeRelatedIntersections(state, action.uuid);
    case ActionTypes.REMOVE_EVENTSERIES:
      return removeRelatedIntersections(state, action.uuid);
    case ActionTypes.RECEIVE_INTERSECTION:
      intersection = state[action.id];
      newIntersection = { ...intersection };
      newIntersection.data =
        action.payload.data ||
        action.payload.events ||
        action.payload.results;
      newState = {...state};
      newState[action.id] = newIntersection;
      return newState;
    case ActionTypes.RECEIVE_INTERSECTION_ERROR:
      handleReceiveError(action);
      return state;
    case ActionTypes.SET_INTERSECTION_SPACE_TIME:
      intersection = {...state[action.id]};
      newIntersection = { ...intersection, spaceTime: action.spaceTime};
      newState = {...state};
      newState[action.id] = newIntersection;
      return newState;
    case ActionTypes.TOGGLE_INTERSECTION:
      intersection = {...state[action.id]};
      intersection.active = !intersection.active;
      newState = {...state};
      newState[action.id] = intersection;
      return newState;
    default:
      return state;
  }
};
