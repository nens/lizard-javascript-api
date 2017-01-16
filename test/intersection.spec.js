import chai from 'chai';
import nock from 'nock';

import Lizard, { actions } from '../src';
import { baseUrl, len } from '../src/utils';
import { equal, fock } from './test-utils'
import omit from 'lodash/omit';

describe('Intersections', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('When adding a raster intersection', () => {

    const RASTER_ID = 'e4g5ds6';
    const DATA_TYPE = 'raster';

    it('adds an intersection synchronously', () => {
      const store = Lizard();
      const intersection = { typeId: RASTER_ID };
      const expected = {...intersection, dataType: DATA_TYPE};

      store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );
      equal(store.getState().intersections[0], expected);
    });

    it('fetches intersection data when active=true', () => {

      const store = Lizard();
      const response = { data: [[0, 3], [2, 4], [4, 1]] };
      const intersection = {
        typeId: RASTER_ID,
        active: true,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });

    it('not fetches intersection data when active=false', () => {

      const store = Lizard();
      const response = { data: undefined };
      const intersection = {
        typeId: RASTER_ID,
        active: false,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });

    it('not fetches intersection data when active=undefined', () => {

      const store = Lizard();
      const response = { data: undefined };
      const intersection = {
        typeId: RASTER_ID,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });

    it('can update it\'s spaceTime after creation', () => {

      const store = Lizard();
      const response = { data: [[0, 3], [2, 4], [4, 1]] };
      const intersection = {
        typeId: RASTER_ID,
        active: true,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
        const updatedSpaceTime = {
          geometry: {
            type: 'Point',
            coordinates: [2, 1]
          }
        };
        store.dispatch(actions.setIntersectionSpaceTime('0', updatedSpaceTime));
        equal(store.getState().intersections[0].spaceTime, updatedSpaceTime);
      });
    });
  });

  describe('When removing a raster intersection', () => {

    const RASTER_ID = 'e4g5ds6';
    const DATA_TYPE = 'raster';

    it('gets removed synchronously', () => {

      const store = Lizard();
      const intersection = { typeId: RASTER_ID };

      // Before we can remove it, it needs to be added:
      store.dispatch(actions.addIntersection(DATA_TYPE, intersection));
      equal(1, len(store.getState().intersections));

      // After is has been added, it can be removed:
      store.dispatch(actions.removeIntersection('0'));
      equal(0, len(store.getState().intersections));
    });

    it('does not remove the raster itself', () => {

      const store = Lizard();

      store.dispatch(actions.addRaster(RASTER_ID));
      equal(1, len(store.getState().rasters));
      equal(0, len(store.getState().intersections));

      const intersection = {
        typeId: RASTER_ID,
        active: true,
        spaceTime: {
          start: 0,
          end: 1
        }
      };

      const expected = {...intersection, dataType: DATA_TYPE, data: [0, 1, 2]};
      fock(expected);

      const whenIntersectionAdded = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      whenIntersectionAdded.then(() => {
        equal(1, len(store.getState().intersections));
        equal(expected.data, store.getState().intersections['0'].data)
        store.dispatch(actions.removeIntersection('0'));
        equal(0, len(store.getState().intersections));
        equal(1, len(store.getState().rasters));
      });
    });
  });

  describe('When removing a raster having intersection(s)', () => {

    const DATA_TYPE = 'raster';
    const RASTER_ID = 'e4g5ds6';
    const response = { name: 'Elevation' };

    it('the actual intersection(s) get removed too', () => {

      const store = Lizard();

      // 1) we first need to add a raster:

      fock(response);

      const whenRasterAdded = store.dispatch(actions.addRaster(RASTER_ID));
      whenRasterAdded.then(() => {
        equal(store.getState().rasters[RASTER_ID], response);
      });

      // 2) we need to add an intersection (on the new raster):

      const intersection = {
        typeId: RASTER_ID,
        active: true,
        spaceTime: {
          start: 0,
          end: 1
        }
      };

      const expected = {...intersection, dataType: DATA_TYPE, data: [0, 1, 2]};

      fock(expected);

      const whenIntersectionAdded = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      // 3) Since the intersection has active=true, data gets auto-fetched when
      //    having dispatched the 'addIntersection' action:

      whenIntersectionAdded.then(() => {
        equal(store.getState().intersections[0].data, expected.data);

        // 4) We remove the raster object:

        store.dispatch(actions.removeRaster(RASTER_ID));
        equal(store.getState().rasters, {});

        // 5) We expect the intersections object to be empty:

        equal(store.getState().intersections, {});

      });
    });
  });

  describe('When adding a timeseries intersection', () => {

    const TIMESERIES_ID = '2cfd26ea-d126-4775-aa3c-e8df3efb3890';
    const DATA_TYPE = 'timeseries';

    it('adds a ts intersection synchronously', () => {

      const store = Lizard();
      const intersection = { typeId: TIMESERIES_ID };
      const expected = {...intersection, dataType: DATA_TYPE};

      store.dispatch(actions.addIntersection(DATA_TYPE, intersection));
      equal(store.getState().intersections[0], expected);
    });

    it('fetches ts intersection data when active=true', () => {

      const store = Lizard();
      const response = { data: [[0, 3], [2, 4], [4, 1]] };
      const intersection = {
        typeId: TIMESERIES_ID,
        active: true,
        spaceTime: {
          start: 0,
          end: 1
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });

    it('not fetches ts intersection data when active=false', () => {

      const store = Lizard();
      const response = { data: undefined };
      const intersection = {
        typeId: TIMESERIES_ID,
        active: false,
        spaceTime: {
          start: 0,
          end: 1
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });

    it('not fetches ts intersection data when active=undefined', () => {

      const store = Lizard();
      const response = { data: undefined };
      const intersection = {
        typeId: TIMESERIES_ID,
        spaceTime: {
          start: 0,
          end: 1
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        equal(store.getState().intersections[0].data, response.data);
      });
    });
  });

  describe('When removing a timeseries intersection', () => {

    const TIMESERIES_ID = '2cfd26ea-d126-4775-aa3c-e8df3efb3890';
    const DATA_TYPE = 'timeseries';

    it('does not remove the timeseries itself', () => {

      const store = Lizard();

      // 1) Add an asset:

      const asset = { entity: 'pumpstation', id: 6853 };
      const KEY = `${asset.entity}$${asset.id}`;
      const response = {
        name: 'The Big One',
        timeseries: [
          {'uuid': TIMESERIES_ID, name: 'The big stream'}
        ]
      };

      fock(response);

      const whenAssetAdded = store.dispatch(
        actions.getAsset(asset.entity, asset.id)
      );

      equal(store.getState().assets[KEY], asset);

      whenAssetAdded.then(() => {
        equal(1, len(store.getState().assets));

        const expectedTs = {...omit(response.timeseries[0], 'uuid'), asset: KEY};

        // 2) The timeseries is retrieved:

        equal(store.getState().timeseries[TIMESERIES_ID], expectedTs);

        // 3) We add an intersection on the timeseries:

        const intersection = {
          typeId: TIMESERIES_ID,
          active: true,
          spaceTime: {
            start: 0,
            end: 1
          }
        };

        const expectedIs = {...intersection, dataType: DATA_TYPE, data: [0, 1, 2]};

        fock(expectedIs);

        const whenIntersectionAdded = store.dispatch(
          actions.addIntersection('timeseries', intersection));

        whenIntersectionAdded.then(() => {
          equal(expectedIs, store.getState().intersections['0']);

          // 4) The intersection gets removed:

          store.dispatch(actions.removeIntersection('0'));
          equal(0, len(store.getState().intersections));

          // 5) The timeseries itself remains untouched:

          equal(store.getState().timeseries[TIMESERIES_ID], expectedTs);
        });
      });
    });
  });

  describe('When removing a timeseries having intersection(s)', () => {

    const TIMESERIES_ID = '2cfd26ea-d126-4775-aa3c-e8df3efb3890';
    const initialState = {
      assets: {
        'pumpstation$6853': {
          entity: 'pumpstation',
          id: 6853,
          name: 'The Big One'
        }
      },
      intersections: {
        '0': {
          dataType: 'timeseries',
          typeId: TIMESERIES_ID,
          active: true,
          spaceTime: { start: 0, end: 1 },
          data: [0, 1, 2]
        }
      },
      timeseries: {
        '2cfd26ea-d126-4775-aa3c-e8df3efb3890': {
          name: 'The big stream',
          asset: 'pumpstation$6853'
        }
      },
      rasters: {},
      eventseries: {}
    }

    const store = Lizard(initialState);

    it('the actual intersection(s) get removed too', () => {

      equal(store.getState(), initialState);

      store.dispatch(actions.removeTimeseries(TIMESERIES_ID));
      equal(0, len(store.getState().timeseries));

      // We check whether the intersection has been thrown away:
      equal(0, len(store.getState().intersections));
    });
  });

  describe('When adding a eventseries intersection', () => {

    const DATA_TYPE = 'eventseries'
    const UUID = 'e89e83d8-f356-4eb9-98c8-8adc7d6582e9';
    const geom = { type: 'Point', coordinates: [0, 1] };

    it('adds an intersection synchronously', () => {

      const store = Lizard();
      const intersection = { typeId: UUID};
      const expected = {...intersection, dataType: DATA_TYPE};

      store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );
      equal(store.getState().intersections[0], expected);
    });

    it('fetches intersection data when active=true', () => {

      const store = Lizard();
      const response = { data: [[0, 3], [2, 4], [4, 1]] };
      const intersection = {
        typeId: UUID,
        active: true,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        const expected = {...intersection, dataType: DATA_TYPE, data: response.data};
        return equal(store.getState().intersections[0], expected);
      });
    });

    it('not fetches intersection data when active=false', () => {

      const store = Lizard();
      const response = { data: [[0, 3], [2, 4], [4, 1]] };
      const intersection = {
        typeId: UUID,
        active: false,
        spaceTime: {
          geometry: {
            type: 'Point',
            coordinates: [1, 0]
          }
        }
      };

      fock(response);

      const whenIntersectionFetched = store.dispatch(
        actions.addIntersection(DATA_TYPE, intersection)
      );

      return whenIntersectionFetched.then(() => {
        const expected = {...intersection, dataType: DATA_TYPE};
        equal(store.getState().intersections[0], expected);
      });
    });
  });
});
