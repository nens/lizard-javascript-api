import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';

let defaultState = {};

export default function (state = defaultState, action) {

  switch (action.type) {
    case ActionTypes.ADD_TIMESERIES:
      let newState = {...state};

      action.timeseries.forEach((ts) => {
        newState[ts.uuid] = omit(ts, 'uuid');
      });
      return newState;
    default:
      return state;
  }
}
