const path = require('path');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const config = mode => ({
  entry: {
    redmachete: './js/main.js',
  },
  output: {
    path: resolve('dist/scripts'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve('js'),
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: eslintFriendlyFormatter,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode,
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} }),
  ],
});

module.exports = config;
