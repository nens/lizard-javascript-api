import {
  ADD_ASSET_SYNC,
  RECIEVE_ASSET,
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

const recieveAsset = (entity, id, data) => {
  return {
    type: RECIEVE_ASSET,
    entity,
    id,
    data
  };
};

export const removeAsset = (index) => {
  return {
    type: REMOVE_ASSET,
    index
  };
};

export const getAsset = (entity, id) => {
  return function (dispatch) {

    dispatch(addAssetSync(entity, id));

    return fetchItem(entity, id)
      .then(asset => {
        dispatch(recieveAsset(entity, id, asset));
        return asset;
      })
      .then(asset => {
        asset.timeseries.forEach(function (ts) {
          ts.assetEntity = entity;
          ts.assetId = id;
        });
        dispatch(addTimeseries(asset.timeseries));
      });
  };
};
