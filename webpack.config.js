const webpack = require('webpack');

const srcDir = './src/js';

const config = {
  entry: `${srcDir}/app.js`,
  output: {
    path: `${__dirname}/dist/js`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};

module.exports = () => ({ config });
