import { ADD_RASTER_SYNC, RECEIVE_RASTER, REMOVE_RASTER } from '../constants/ActionTypes';

import { fetchItem } from '../utils';

export const addRasterSync = (id) => {
  return {
    type: ADD_RASTER_SYNC,
    id
  };
};

export const removeRaster = (id) => {
  return {
    type: REMOVE_RASTER,
    id
  };
};

const receiveRaster = (id, data) => {
  return {
    type: RECEIVE_RASTER,
    id,
    data
  };
};

export const addRaster = (id) => {
  return function (dispatch) {
    dispatch(addRasterSync(id));
    return fetchItem('raster', id)
      .then(data => {
        dispatch(receiveRaster(id, data));
        return data;
      }
    );
  };
};
