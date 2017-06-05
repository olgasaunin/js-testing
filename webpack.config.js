const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
});

const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({ })

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ['css-loader', 'postcss-loader','sass-loader']
        })
      }
    ]
  },
  plugins: [
    extractPlugin,
    uglifyJsPlugin
  ]
};
