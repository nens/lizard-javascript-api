import chai from 'chai';

import Lizard, {actions} from '../src';

chai.expect();

const expect = chai.expect;

describe('Intersections', () => {

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

      // TODO: use nock to check if resource is fetched with geom in WKT and
      // check if reponse is parsed correctly.

      // const store = Lizard();
      //
      // const RESPONSE = {
      //   data: [[0, 3], [2, 4], [4, 1]]
      // };
      //
      // const resource = nock('raster-aggregates')
      // .get('/')
      // .reply(200, { body: RESPONSE});
      //
      // const ACTIVE_INTERSECTION = {
      //   typeId: RASTER_ID,
      //   active: true,
      //
      //   spaceTime: {
      //     geometry: {
      //       type: 'Point',
      //       coordinates: [1, 0]
      //     }
      //   }
      // };
      //
      // const whenIntersectionFetched = store.dispatch(
      //   actions.addIntersection(DATA_TYPE, ACTIVE_INTERSECTION)
      // );
      //
      // expect(resource.isDone()).to.be.true;
      //
      // whenIntersectionFetched
      // .then(() => {
      //   expect(store.getState().intersections[0].data).to.deep.equal(RESPONSE.data);
      // });

    });

  });

});
