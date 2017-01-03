import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

let defaultState = {};

let intersection = {};

let newIntersection = {};

let newState = {};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_INTERSECTION_SYNC:
      newState = {...state};
      newState[action.id] = omit(action, 'id', 'type');
      return newState;
    case ActionTypes.REMOVE_INTERSECTION:
      return omit(state, action.id);
    case ActionTypes.RECIEVE_INTERSECTION:
      intersection = state[action.id];

      newIntersection = {...intersection};

      Object.assign(newIntersection, pick(action.data, ['events']));
      newState = {...state};
      newState[action.id] = newIntersection;
      return newState;
    case ActionTypes.SET_INTERSECTION_SPACE_TIME:
      intersection = {...state[action.id]};
      newIntersection = Object.assign(
        {},
        intersection,
        {spaceTime: action.spaceTime}
      );

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
}
