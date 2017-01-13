import fetch from 'isomorphic-fetch';

const baseUrl = (() => {
  let absoluteBase = 'http://demo.lizard.net';

  if (typeof window !== 'undefined') {
    const protocol = window && window.location.protocol;
    const hostname = window && window.location.hostname;
    const port = window && window.location.port;

    absoluteBase = `${protocol}://${hostname}:${port}`;
  }
  return absoluteBase;
})();

// Polymorphic length: works for both JS objects and JS arrays.
const len = (collection) => {
  if (typeof collection === typeof {}) {
    return Object.keys(collection).length;
  } else if (typeof collection === typeof []) {
    return collection.length;
  }
};

const fetchItem = (entity, id) => {
  const plural = entity + 's';
  const request = new Request(`${baseUrl}/api/v2/${plural}/${id}`, {
    credentials: 'same-origin'
  });

  return fetch(request).then(response => response.json());
};

/**
 * Stringifies a GeoJSON object into WKT
 */
const geomToWkt = (gj) => {
  if (gj.type === 'Feature') {
    gj = gj.geometry;
  }

  function wrapParens(s) { return '(' + s + ')'; }

  function pairWKT(c) {
    return c.join(' ');
  }

  function ringWKT(r) {
    return r.map(pairWKT).join(', ');
  }

  function ringsWKT(r) {
    return r.map(ringWKT).map(wrapParens).join(', ');
  }

  function multiRingsWKT(r) {
    return r.map(ringsWKT).map(wrapParens).join(', ');
  }

  switch (gj.type) {
    case 'Point':
      return 'POINT (' + pairWKT(gj.coordinates) + ')';
    case 'LineString':
      return 'LINESTRING (' + ringWKT(gj.coordinates) + ')';
    case 'Polygon':
      return 'POLYGON (' + ringsWKT(gj.coordinates) + ')';
    case 'MultiPoint':
      return 'MULTIPOINT (' + ringWKT(gj.coordinates) + ')';
    case 'MultiPolygon':
      return 'MULTIPOLYGON (' + multiRingsWKT(gj.coordinates) + ')';
    case 'MultiLineString':
      return 'MULTILINESTRING (' + ringsWKT(gj.coordinates) + ')';
    case 'GeometryCollection':
      return 'GEOMETRYCOLLECTION (' + gj.geometries.map(this.geomToWkt).join(', ') + ')';
    default:
      throw new Error('geomToWkt requires a valid GeoJSON Feature or geometry object as input');
  }
};

module.exports = { fetchItem, geomToWkt, baseUrl, len };
