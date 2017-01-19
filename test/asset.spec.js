import omit from 'lodash/omit';
import size from 'lodash/size';

import Lizard, { actions } from '../src';
import { baseUrl } from '../src/utils';
import { equal, unequal, fock } from './test-utils';

describe('Assets', () => {

  describe('When adding an asset', () => {

    const store = Lizard();
    const ASSET = { entity: 'pumpstation', id: 6853 };
    const KEY = `${ASSET.entity}$${ASSET.id}`;
    const INIT_ASSET_COUNT = size(store.getState().assets);

    const RESPONSE = {
      name: 'The Big One',
      timeseries: [
        {'uuid': 'DEADBEEF', name: 'The big stream' }
      ],
    };

    fock(RESPONSE);

    let whenAssetAdded = store.dispatch(
      actions.getAsset(ASSET.entity, ASSET.id)
    );

    it('changes the amount of assets present in the store (in-sync)', () => {
      unequal(size(store.getState().assets), INIT_ASSET_COUNT);
    });

    it('intializes the error info correctly', () => {
      equal(store.getState().assets.hasOwnProperty('error'), true);
      equal(store.getState().assets.error, false);
    });
  });

  describe('When adding an asset with correct type/id', () => {

    const store = Lizard();
    const ASSET = { entity: 'pumpstation', id: 6853 };
    const KEY = `${ASSET.entity}$${ASSET.id}`;
    const TIMESERIES_KEY = 'kdj324js3';

    const RESPONSE = {
      name: 'The Big One',
      timeseries: [
        {'uuid': TIMESERIES_KEY, name: 'The big stream' }
      ],
    };

    fock(RESPONSE);

    let whenAssetAdded = store.dispatch(
      actions.getAsset(ASSET.entity, ASSET.id)
    );

    it('fetches asset from server (a-sync)', () => {
      const expected = { ...ASSET, name: RESPONSE.name };
      return whenAssetAdded.then(() => {
        equal(store.getState().assets[KEY], expected);
      });
    });

    it('stores timeseries in store.timeseries (a-sync)', () => {
      const expected = { asset: KEY, ...omit(RESPONSE.timeseries[0], 'uuid')};
      return whenAssetAdded.then(() => {
        equal(store.getState().timeseries[TIMESERIES_KEY], expected);
      });
    });
  });

  describe('When adding an asset with unknown type/id', () => {

    const store = Lizard();
    const ASSET = { entity: 'pumpstation', id: 99999999999 };
    const KEY = `${ASSET.entity}$${ASSET.id}`;

    const RESPONSE = {
      message: 'Pumpstation with id ' + ASSET.id + ' was not found.'
    };

    fock(RESPONSE, 404);

    const whenAssetAdded = store.dispatch(
      actions.getAsset(ASSET.entity, ASSET.id)
    );

    it('does not receive asset data from the server (a-sync)', () => {
      return whenAssetAdded.then(() => {
        equal(store.getState().assets[KEY], ASSET);
      });
    });

    it('does not receive timeseries data from the server (a-sync)', () => {
      return whenAssetAdded.then(() => {
        equal(store.getState().assets[KEY].timeseries, undefined);
      });
    });

    it('updates state.assets to show there was an error (a-sync)', () => {
      return whenAssetAdded.then(() => {
        equal(typeof store.getState().assets.error, typeof '');
      });
    });

  });

  describe('When having assets and timeseries', () => {
    const weirTimeseries = {
      name: 'terra',
      asset: 'weir$3'
    };

    const initialState = {
      assets: {
        'pumpstation$5': {
          entity: 'pumpstation',
          id: 5,
          name: 'the big one'
        },
        'weir$3': {
          entity: 'weir',
          id: 3,
          name: 'the small weir'
        }
      },
      timeseries: {
        'efs34sdf3': {
          name: 'water',
          asset: 'pumpstation$5'
        },
        '6wlaiejl21': {
          name: 'fire',
          asset: 'pumpstation$5'
        },
        '76ghju1se3': weirTimeseries
      }
    };

    const store = Lizard(initialState);

    describe('And removing an asset', () => {

      store.dispatch(actions.removeAsset('pumpstation', 5));

      let expected;

      it('removes it (in-sync)', () => {
        expected = { 'weir$3': initialState.assets['weir$3'] };
        equal(store.getState().assets, expected);
      });

      it('removes all associated timeseries (in-sync)', () => {
        expected = { '76ghju1se3': weirTimeseries };
        equal(store.getState().timeseries, expected);
      });

    });

  });

});
