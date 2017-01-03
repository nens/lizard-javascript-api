import { ADD_RASTER_SYNC, RECIEVE_RASTER, REMOVE_RASTER } from '../constants/ActionTypes';

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

const recieveRaster = (id, data) => {
  return {
    type: RECIEVE_RASTER,
    id,
    data
  };
};

export const addRaster = (id) => {
  return function (dispatch) {
    dispatch(addRasterSync(id));
    return fetchItem('raster', id)
      .then(data => {
        dispatch(recieveRaster(id, data));
        return data;
      }
    );
  };
};
