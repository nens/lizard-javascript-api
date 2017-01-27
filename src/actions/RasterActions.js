import {
  ADD_RASTER_SYNC,
  RECEIVE_RASTER_SUCCESS,
  RECEIVE_RASTER_FAILURE,
  REMOVE_RASTER
} from '../constants/ActionTypes';

import { CALL_API } from '../middleware/api';
import { handleReceiveError } from '../utils';

// Fetches a single raster from Lizard API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchRaster = (id) => ({
  [CALL_API]: {
    types: [ ADD_RASTER_SYNC, RECEIVE_RASTER_SUCCESS, RECEIVE_RASTER_FAILURE ],
    entity: 'raster',
    id
  }
});

export const removeRaster = (id) => {
  return {
    type: REMOVE_RASTER,
    id
  };
};

export const addRaster = (id) => {
  return function (dispatch) {
    return dispatch(fetchRaster(id))
    .catch(e => {
      handleReceiveError(e);
    });
  };
};
