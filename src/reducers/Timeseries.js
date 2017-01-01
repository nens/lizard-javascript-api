import * as ActionTypes from '../constants/ActionTypes';

let defaultState = [];

export default function (state = defaultState, action) {

  switch (action.type) {
    case ActionTypes.ADD_TIMESERIES:
      return [
        ...state,
        [
          ...action.timeseries
        ]];
    default:
      return state;
  }
}
