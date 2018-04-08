const path = require('path');

const config = (mode) => ({
  entry: {
    redmachete: './js/main.js',
  },
  output: {
    path: path.join(__dirname, 'dist', 'scripts'),
    filename: '[name].js',
  },
  module: {
    rules: [
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
});

module.exports = config;
