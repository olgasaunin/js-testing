const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
});

const providerPlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})

const cleanWebPackPlugin = new CleanWebpackPlugin(['dist'])

const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({ })

module.exports = {
  entry: {
    index: [
      path.resolve(__dirname, 'app/index.js'),
      path.resolve(__dirname, 'app/sass/main.scss')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'es2017'],
              plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread']
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: 'inline'
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    extractPlugin,
    providerPlugin,
    cleanWebPackPlugin,
    uglifyJsPlugin
  ],
  devServer: {
    host: 'localhost',
    port: 7000,
    open: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
