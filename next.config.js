const withTM = require('next-transpile-modules')(['three-geojson-geometry', 'd3-geo']);

module.exports = withTM({
  experimental: {
    esmExternals: 'loose'
  }
});
