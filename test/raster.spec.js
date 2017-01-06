import chai from 'chai';
import nock from 'nock';

import Lizard, {actions} from '../src';

chai.expect();

const expect = chai.expect;

describe('Rasters', () => {
  const ID = 'e4g5ds6';

  const RESPONSE = { name: 'Elevation' };

  describe('When adding a raster', () => {
    const store = Lizard();

    nock('raster')
    .get(`/${ID}`)
    .reply(200, { body: RESPONSE });

    const whenRasterAdded = store.dispatch(actions.addRaster(ID));

    it('creates raster synchronous', () => {
      expect(store.getState().rasters[ID]).to.deep.equal({});
    });

    it('fetches raster', () => {
      whenRasterAdded
        .then(() => {
          expect(store.getState.rasters[ID]).toEqual(RESPONSE);
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
