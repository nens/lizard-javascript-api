import * as ActionTypes from '../constants/ActionTypes';
import get from 'lodash/get';
import omit from 'lodash/omit';

let defaultState = {};

let newState = {};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_RASTER_SYNC:
      newState = {...state};
      newState[action.id] = {};
      return newState;
    case ActionTypes.REMOVE_RASTER:
      return omit(state, action.id);
    case ActionTypes.RECEIVE_RASTER:
      let raster = get(state, action.id);

      const newRaster = {...raster, ...omit(action.data, 'uuid')};

      newState = {...state};
      newState[action.id] = newRaster;
      return newState;
    default:
      return state;
  }
}
