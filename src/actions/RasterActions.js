import {
  ADD_RASTER_SYNC,
  RECEIVE_RASTER_SUCCESS,
  RECEIVE_RASTER_FAILURE,
  REMOVE_RASTER
} from '../constants/ActionTypes';

import { fetchItem } from '../utils';

export const addRasterSync = (id) => {
  return {
    type: ADD_RASTER_SYNC,
    id
  };
};

const receiveRasterSuccess = (id, data) => {
  return {
    type: RECEIVE_RASTER_SUCCESS,
    id,
    data
  };
};

const receiveRasterFailure = (id, error) => {
  return {
    type: RECEIVE_RASTER_FAILURE,
    id,
    error
  };
};

export const removeRaster = (id) => {
  return {
    type: REMOVE_RASTER,
    id
  };
};

export const addRaster = (id) => {
  return function (dispatch) {
    dispatch(addRasterSync(id));
    return fetchItem('raster', id)
      .then(data => {
        dispatch(receiveRasterSuccess(id, data));
        return data;
      }).catch(errorObject => {
        dispatch(receiveRasterFailure(id, errorObject.toString()));
      });
  };
};
