/**
 * RDFa plugin for jsonld.js.
 *
 * @author Digital Bazaar, Inc.
 *
 * Copyright 2010-2019 Digital Bazaar, Inc.
 */
if(require('semver').gte(process.version, '8.6.0')) {
  module.exports = require('./jsonld-rdfa');
} else {
  module.exports = require('../dist/node6/lib/jsonld-rdfa');
}
