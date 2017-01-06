import {
  ADD_ASSET_SYNC,
  RECEIVE_ASSET,
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

const receiveAsset = (entity, id, data) => {
  return {
    type: RECEIVE_ASSET,
    entity,
    id,
    data
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
        dispatch(receiveAsset(entity, id, asset));
        return asset;
      })
      .then(asset => {
        asset.timeseries.forEach(function (ts) {
          ts.asset = `${entity}$${id}`;
        });
        dispatch(addTimeseries(asset.timeseries));
      });
  };
};
