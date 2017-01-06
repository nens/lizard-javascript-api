import chai from 'chai';
import nock from 'nock';

import Lizard, {actions} from '../src';
import {baseUrl} from '../src/utils';

chai.expect();

const expect = chai.expect;

describe('Intersections', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('When adding a raster intersection', () => {

    const RASTER_ID = 'e4g5ds6';

    const DATA_TYPE = 'raster';

    it('adds an intersection synchronously', () => {
      const store = Lizard();

      const INTERSECTION = { typeId: RASTER_ID };

      store.dispatch(
        actions.addIntersection(DATA_TYPE, INTERSECTION)
      );

      const expected = {...INTERSECTION};

      expected.dataType = DATA_TYPE;
      expect(store.getState().intersections[0]).to.deep.equal(expected);
    });

    it('fetches intersection when active', () => {

      const store = Lizard();

      const RESPONSE = {
        data: [[0, 3], [2, 4], [4, 1]]
      };

      nock(baseUrl)
      .get('/api/v2/raster-aggregates/?geom=POINT%20(1%200)&srs=EPSG%3A4326&rasters=e4g5ds6')
      .reply(200, RESPONSE);

      const ACTIVE_INTERSECTION = {
        typeId: RASTER_ID,
        active: true,

        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, ACTIVE_INTERSECTION)
      );

      return whenIntersectionFetched
      .then(() => {
        expect(store.getState().intersections[0].data).to.deep.equal(RESPONSE.data);
      });

    });

  });

  describe('When adding a timeseries intersection', () => {
    // TODO: implement test specifically for timeseries.
  });

});
