import chai from 'chai';
import nock from 'nock';
import omit from 'lodash/omit';

import Lizard, {actions} from '../src';
import {baseUrl} from '../src/utils';

chai.expect();

const expect = chai.expect;

describe('Assets', () => {

  describe('When adding an asset', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    const store = Lizard();

    const ASSET = {
      entity: 'pumpstation',
      id: 6853
    };

    const KEY = `${ASSET.entity}$${ASSET.id}`;

    const TIMESERIES_KEY = 'kdj324js3';

    const RESPONSE = {
      name: 'The Big One',
      timeseries: [
        {'uuid': TIMESERIES_KEY, name: 'The big stream'}
      ]
    };

    nock(baseUrl)
    .get(`/api/v2/${ASSET.entity}s/${ASSET.id}`)
    .reply(200, RESPONSE);

    const whenAssetAdded = store.dispatch(
      actions.getAsset(ASSET.entity, ASSET.id)
    );

    it('adds an asset synchronously', () => {
      const unsubscribe = store.subscribe(() => {
        expect(store.getState().assets[KEY]).to.deep.equal(ASSET);
        unsubscribe();
      });
    });

    it('fetches asset from server', () => {
      const expectedStoreItem = {...ASSET, name: RESPONSE.name};

      return whenAssetAdded.then(() => {
        expect(store.getState().assets[KEY]).to.deep.equal(expectedStoreItem);
      });
    });

    it('stores timeseries in store.timeseries', () => {
      return whenAssetAdded.then(() => {
        const expected = omit(RESPONSE.timeseries[0], 'uuid');

        expected.asset = KEY;
        expect(store.getState().timeseries[TIMESERIES_KEY]).to.deep.equal(expected);
      });
    });

  });

  describe('When having assets and timeseries', () => {
    const WEIR_TIMESERIES = {
      name: 'terra',
      asset: 'weir$3'
    };

    const INITIAL = {
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
        '76ghju1se3': WEIR_TIMESERIES
      }
    };

    const store = Lizard(INITIAL);

    describe('And removing an asset', () => {

      store.dispatch(actions.removeAsset('pumpstation', 5));
      const EXPECTED_ASSETS = { 'weir$3': INITIAL.assets['weir$3'] };

      it('removes it synchronously', () => {
        expect(store.getState().assets).to.deep.equal(EXPECTED_ASSETS);
      });

      it('removes all associated timeseries synchronously', () => {
        const EXPECTED_TIMESERIES = { '76ghju1se3': WEIR_TIMESERIES };
        return expect(store.getState().timeseries).to.deep.equal(EXPECTED_TIMESERIES);
      });

    });

  });

});
