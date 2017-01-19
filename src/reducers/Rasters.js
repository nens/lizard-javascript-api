import * as ActionTypes from '../constants/ActionTypes';
import get from 'lodash/get';
import omit from 'lodash/omit';
import handleReceiveError from '../utils';

let defaultState = {};

export default function (state = defaultState, action) {

  let newState = { ...state };

  switch (action.type) {
    case ActionTypes.ADD_RASTER_SYNC:
      newState.error = false;
      newState[action.id] = {};
      return newState;
    case ActionTypes.RECEIVE_RASTER_SUCCESS:
      newState.error = false;
      const raster = get(state, action.id);
      const newRaster = { ...raster, ...omit(action.data, 'uuid') };

      newState[action.id] = newRaster;
      return newState;
    case ActionTypes.RECEIVE_RASTER_FAILURE:
      newState.error = action.error;
      handleReceiveError(action);
      return state;
    case ActionTypes.REMOVE_RASTER:
      return omit(state, action.id);
    default:
      return state;
  }
}
