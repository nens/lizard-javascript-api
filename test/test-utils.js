import chai from 'chai';
import nock from 'nock';
import { baseUrl } from '../src/utils';

///////////////////////////////////////////////////////////////////////////////
// Short-hand for comparing two results when testing:

const equal = (a, b) => {
  return chai.expect(a).to.deep.equal(b);
};

///////////////////////////////////////////////////////////////////////////////
// Wrapper for nock which ignores the final part of the URI. If not using this
// wrapper unexpected results can occur, the most evident being that the
// following two URLS are considered different:
//
// http://www.example.com/?arg1=foo&arg2=bar
// http://www.example.com/?arg2=bar&arg1=foo
//
// ..and also the following two URLs:
//
// http://www.example.com/?arg1=foo&arg2=bar
// http://www.example.com/%3Farg1%3Dfoo%26arg2%3Dbar
//
// Although any HTTP server will consider these two URIs equal, nock doesn't.
// With this wrapper the problem is solved.

const fock = (response) => {
  nock(baseUrl)
    .filteringPath((path) => '/watevar' )
    .get('/watevar')
    .reply(200, response);
};

module.exports = { equal, fock };