import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';
import forEach from 'lodash/forEach';

let defaultState = {};
let newState;

export default function (state = defaultState, action) {

  switch (action.type) {
    case ActionTypes.ADD_TIMESERIES:
      newState = { ...state };
      action.timeseries.forEach((ts) => {
        newState[ts.uuid] = omit(ts, 'uuid');
      });
      return newState;
    case ActionTypes.REMOVE_TIMESERIES:
      newState = { ...state };
      delete newState[action.uuid];
      return newState;
    case ActionTypes.REMOVE_ASSET:
      let assetKey = `${action.entity}$${action.id}`;

      newState = {...state};
      forEach(newState, (ts, tsUuid) => {
        if (ts.asset === assetKey) {
          delete newState[tsUuid];
        }
      });
      return newState;
    default:
      return state;
  }
}
