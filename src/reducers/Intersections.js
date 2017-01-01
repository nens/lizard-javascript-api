import * as ActionTypes from '../constants/ActionTypes';
import filter from 'lodash/filter';
import find from 'lodash/find';
import pick from 'lodash/pick';

const findIntersection = (intersections, id) => {
  return find(intersections, (item) => {
    return item.id === id;
  });
};

let defaultState = [];

let intersection = {};

let newState = [];

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_INTERSECTION_SYNC:
      return [
        ...state,
        {
          type: action.dataType,
          ...action.intersection
        }
      ];
    case ActionTypes.REMOVE_INTERSECTION:
      return filter(state, (intersection, index) => index !== action.index);
    case ActionTypes.RECIEVE_INTERSECTION:
      intersection = findIntersection(state, action.id);
      const index = state.indexOf(intersection);

      const newIntersection = {...intersection};

      Object.assign(newIntersection, pick(action.data, ['events']));
      newState = [...state];
      newState[index] = newIntersection;
      return newState;
    case ActionTypes.SET_INTERSECTION_SPACE_TIME:
      intersection = {...state[action.index]};
      Object.assign(intersection, {spaceTime: action.spaceTime});
      newState = [...state];
      newState[action.index] = intersection;
      return newState;
    case ActionTypes.TOGGLE_INTERSECTION:
      intersection = {...state[action.index]};
      intersection.active = !intersection.active;
      newState = [...state];
      newState[action.index] = intersection;
      return newState;
    default:
      return state;
  }
}
