import chai from 'chai';
import nock from 'nock';
import {baseUrl} from '../src/utils';

import Lizard, {actions} from '../src';

chai.expect();

const expect = chai.expect;

describe('Rasters', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const ID = 'e4g5ds6';

  const RESPONSE = { name: 'Elevation' };

  describe('When adding a raster', () => {
    const store = Lizard();

    nock(baseUrl)
    .get(`/api/v2/rasters/${ID}`)
    .reply(200, RESPONSE);

    const whenRasterAdded = store.dispatch(actions.addRaster(ID));

    it('creates raster synchronous', () => {
      const unsubscribe = store.subscribe(() => {
        expect(store.getState().rasters[ID]).to.deep.equal({});
        unsubscribe();
      });
    });

    it('fetches raster', () => {
      return whenRasterAdded
        .then(() => {
          expect(store.getState().rasters[ID]).to.deep.equal(RESPONSE);
        });
    });

  });

  describe('When having rasters', () => {
    const INITIAL = {
      'e4g5ds6': RESPONSE,
      'otherRaster': { name: 'remove me' }
    };

    const store = Lizard({rasters: INITIAL});

    store.dispatch(actions.removeRaster('otherRaster'));
    expect(store.getState().rasters).to.deep.equal({'e4g5ds6': RESPONSE});
  });
});
