import * as ActionTypes from '../constants/ActionTypes';
import omit from 'lodash/omit';

let defaultState = {};

let newState = {};

export default function (state = defaultState, action) {

  switch (action.type) {
    case ActionTypes.ADD_ASSET_SYNC:
      newState = {...state};

      newState[`${action.entity}$${action.id}`] = {
        entity: action.entity,
        id: action.id
      };
      return newState;
    case ActionTypes.REMOVE_ASSET:
      return omit(state, `${action.entity}$${action.id}`);
    case ActionTypes.RECEIVE_ASSET:
      const key = `${action.entity}$${action.id}`;

      const asset = state[key];

      const newAsset = {...asset};

      Object.assign(newAsset, omit(action.data, 'timeseries'));
      newState = {...state};

      newState[key] = newAsset;

      return newState;
    default:
      return state;
  }
}
