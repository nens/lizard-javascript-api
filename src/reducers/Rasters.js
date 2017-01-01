import * as ActionTypes from '../constants/ActionTypes';
import find from 'lodash/find';
import filter from 'lodash/filter';

let defaultState = [];

const findRaster = (rasters, id) => {
  return find(rasters, (item) => {
    return id.includes(item.id) || item.id.includes(id);
  });
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.ADD_RASTER_SYNC:
      return [...state, {id: action.id, name: action.name}];
    case ActionTypes.REMOVE_RASTER:
      return filter(state, (raster, index) => {
        return index !== action.index;
      });
    case ActionTypes.RECIEVE_RASTER:
      let raster = findRaster(state, action.id);

      const index = state.indexOf(raster);

      const newRaster = {...raster};

      Object.assign(newRaster, action.data);
      const newState = [...state];

      newState[index] = newRaster;

      return newState;
    default:
      return state;
  }
}
