import * as ActionTypes from '../constants/ActionTypes';
import find from 'lodash/find';
import filter from 'lodash/filter';
import omit from 'lodash/omit';

let defaultState = [];

const findAsset = (assets, entity, id) => {
  return find(assets, (item) => {
    return item.entity === entity && item.id === id;
  });
};

export default function (state = defaultState, action) {
  let asset;

  switch (action.type) {
    case ActionTypes.ADD_ASSET_SYNC:
      return [...state, {entity: action.entity, id: action.id}];
    case ActionTypes.REMOVE_ASSET:
      return filter(state, (asset, index) => {
        return index !== action.index;
      });
    case ActionTypes.RECIEVE_ASSET:
      asset = findAsset(state, action.entity, action.id);
      const index = state.indexOf(asset);

      const newAsset = {...asset};

      Object.assign(newAsset, omit(action.data, 'timeseries'));
      const newState = [...state];

      newState[index] = newAsset;

      return newState;
    default:
      return state;
  }
}
