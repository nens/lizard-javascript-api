import {
  ADD_ASSET_SYNC,
  RECEIVE_ASSET_SUCCESS,
  RECEIVE_ASSET_FAILURE,
  REMOVE_ASSET
} from '../constants/ActionTypes';

import { CALL_API } from '../middleware/api';
import { handleReceiveError } from '../utils';
import { addTimeseries } from './TimeseriesActions';

// Fetches a single asset from Lizard API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchAsset = (entity, id) => ({
  [CALL_API]: {
    types: [ ADD_ASSET_SYNC, RECEIVE_ASSET_SUCCESS, RECEIVE_ASSET_FAILURE ],
    entity,
    id
  }
});

export const removeAsset = (entity, id) => {
  return {
    type: REMOVE_ASSET,
    entity,
    id
  };
};

export const getAsset = (entity, id) => {
  return function (dispatch) {
    return dispatch(fetchAsset(entity, id))
    .then(asset => {
      asset.timeseries.forEach(function (ts) {
        ts.asset = `${entity}$${id}`;
      });
      dispatch(addTimeseries(asset.timeseries));
      return asset;
    })
    .catch(e => {
      handleReceiveError(e);
    });
  };
};
