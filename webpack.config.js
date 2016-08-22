/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './docs/index.js',
  },
  output: {
    path: './docs',
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  devServer: {
    contentBase: 'docs',
    inline: true,
    noInfo: true,
  },
};
