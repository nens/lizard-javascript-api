import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';
import { handleReceiveError } from '../utils';

let defaultState = {};

export default function (state = defaultState, action) {

  const KEY = `${action.entity}$${action.id}`;
  let newState = { ...state };

  switch (action.type) {
    case ActionTypes.ADD_ASSET_SYNC:
      newState.error = false;
      newState[KEY] = { entity: action.entity, id: action.id };
      return newState;
    case ActionTypes.RECEIVE_ASSET_SUCCESS:
      const asset = state[KEY];
      const newAsset = { ...asset, ...omit(action.data, 'timeseries') };

      newState.error = false;
      newState[KEY] = newAsset;
      return newState;
    case ActionTypes.RECEIVE_ASSET_FAILURE:
      handleReceiveError(action);
      newState.error = action.error;
      return newState;
    case ActionTypes.REMOVE_ASSET:
      return omit(state, KEY);
    default:
      return state;
  }
}
