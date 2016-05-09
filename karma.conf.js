'use strict';

const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      'test/index.js'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,

    // Webpack preprocessor
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
          }
        ],
      },
    },

  });
};
