'use strict';

const join = require('path').join;
const webpack = require('webpack');

const config = {
  entry: join(__dirname, 'index.js'),

  output: {
    filename: join(__dirname, 'bundle.js'),
  },

  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel?presets[]=es2015&presets[]=react',
      },
    ]
  },
};

module.exports = config;
