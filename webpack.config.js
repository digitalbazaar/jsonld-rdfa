/**
 * jsonld-rdfa webpack build rules.
 *
 * @author Digital Bazaar, Inc.
 *
 * Copyright 2019 Digital Bazaar, Inc.
 */
const path = require('path');
const webpackMerge = require('webpack-merge');

// build multiple outputs
module.exports = [];

// custom setup for each output
// all built files will export the "jsonld-rdfa" library but with different
// content
const outputs = [
  // core jsonld-rdfa library
  {
    entry: [
      // main lib
      './lib/index.js'
    ],
    filenameBase: 'jsonld-rdfa'
  }
];

outputs.forEach(info => {
  // common to bundle and minified
  const common = {
    // each output uses the "jsonld-rdfa" name but with different contents
    entry: {
      'jsonld-rdfa': info.entry
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    //debug: true,
                  }
                ]
              ],
              plugins: [
                [
                  '@babel/plugin-proposal-object-rest-spread',
                  {useBuiltIns: true}
                ],
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        }
      ]
    },
    externals: {
      jsonld: 'jsonld'
    },
    // disable various node shims as jsonld handles this manually
    node: {
      Buffer: false,
      crypto: false,
      process: false,
      setImmediate: false
    }
  };

  // plain unoptimized unminified bundle
  const bundle = webpackMerge(common, {
    mode: 'development',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: info.filenameBase + '.js',
      library: info.library || '[name]',
      libraryTarget: info.libraryTarget || 'umd'
    }
  });
  if(info.library === null) {
    delete bundle.output.library;
  }
  if(info.libraryTarget === null) {
    delete bundle.output.libraryTarget;
  }

  // optimized and minified bundle
  const minify = webpackMerge(common, {
    mode: 'production',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: info.filenameBase + '.min.js',
      library: info.library || '[name]',
      libraryTarget: info.libraryTarget || 'umd'
    },
    devtool: 'cheap-module-source-map'
  });
  if(info.library === null) {
    delete minify.output.library;
  }
  if(info.libraryTarget === null) {
    delete minify.output.libraryTarget;
  }

  module.exports.push(bundle);
  module.exports.push(minify);
});
