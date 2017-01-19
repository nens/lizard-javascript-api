import {
  ADD_ASSET_SYNC,
  RECEIVE_ASSET_SUCCESS,
  RECEIVE_ASSET_FAILURE,
  REMOVE_ASSET
} from '../constants/ActionTypes';

import { fetchItem } from '../utils';

import { addTimeseries } from './TimeseriesActions';

const addAssetSync = (entity, id) => {
  return {
    type: ADD_ASSET_SYNC,
    entity,
    id
  };
};

const receiveAssetSuccess = (entity, id, data) => {
  return {
    type: RECEIVE_ASSET_SUCCESS,
    entity,
    id,
    data
  };
};

const receiveAssetFailure = (entity, id, error) => {
  return {
    type: RECEIVE_ASSET_FAILURE,
    entity,
    id,
    error
  };
};

export const removeAsset = (entity, id) => {
  return {
    type: REMOVE_ASSET,
    entity,
    id
  };
};

export const getAsset = (entity, id) => {
  return function (dispatch) {
    dispatch(addAssetSync(entity, id));
    return fetchItem(entity, id)
      .then(asset => {
        asset.timeseries.forEach(function (ts) {
          ts.asset = `${entity}$${id}`;
        });
        dispatch(receiveAssetSuccess(entity, id, asset));
        dispatch(addTimeseries(asset.timeseries));
        return asset;
      })
      .catch(errorObject => {
        dispatch(receiveAssetFailure(entity, id, errorObject.toString()));
      });
  };
};
