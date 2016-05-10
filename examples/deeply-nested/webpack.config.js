'use strict';

const join = require('path').join;
const webpack = require('webpack');

const config = {
  entry: {
    connect: join(__dirname, 'index-connect.js'),
    observe: join(__dirname, 'index-observe.js'),
  },

  output: {
    filename: join(__dirname, 'bundle-[name].js'),
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
