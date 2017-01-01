import Lizard from '../lib/Lizard.js';
import externalEntity from './mockExternalEntity';

import chai from 'chai';

chai.expect();

const expect = chai.expect;

describe('Given a default Lizard store', function () {
  const l = Lizard();

  describe('when I call getState', function () {
    it('should return the empty state', () => {
      expect(l.getState()).to.deep.equal({
        assets: [],
        intersections: [],
        timeseries: [],
        rasters: []
      });
    });
  });
});

describe('Given a Lizard store with initial state', function () {
  const initial = {assets: [{entity: 'overflow', id: 5}]};

  const lWithInitial = Lizard(initial);

  describe('when I call getState', function () {
    it('should contain the initial state', () => {
      expect(lWithInitial.getState().assets).to.equal(initial.assets);
    });
  });
});

describe('Given a Lizard store with an external reducer', function () {
  const lWithReducers = Lizard({}, { externalEntity });

  describe('when I call getState', function () {
    it('should contain the external entity', () => {
      expect(lWithReducers.getState()).to.include.keys('externalEntity');
    });
  });
  describe('when I dispatch an external action', function () {
    lWithReducers.dispatch({type: 'EXTERNAL_ACTION'});
    it('should handle the external action', () => {
      expect(lWithReducers.getState().externalEntity).to.equal('done');
    });
  });
});
