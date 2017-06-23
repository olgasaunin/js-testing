const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
});

const providerPlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})

const cleanWebPackPlugin = new CleanWebpackPlugin(['dist'])

//const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({ })

const minifyPlugin = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false
})

module.exports = {
  entry: {
    index: [
      //path.resolve(__dirname, 'app/index.pug'),
      path.resolve(__dirname, 'app/index.js'),
      path.resolve(__dirname, 'app/sass/main.scss')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    //publicPath: '/dist'
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
              presets:  [
                [ 'es2015', { modules: false } ],
                [ 'es2017' ]
              ],
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
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: ['html-loader']
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [{ loader: 'html-loader' },
        { loader: 'pug-html-loader',
          options: {
            name: '[name],[ext]'
          }
        }
        ]
      },
      {
        test: /\.(jpg|png)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name],[ext]',
              outputPath: 'images/',
              // publicPath: 'images/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractPlugin,
    providerPlugin,
    cleanWebPackPlugin,
    //uglifyJsPlugin,
    new HtmlWebpackPlugin({
      template: 'app/index.pug',
      filename: 'index.html',
      chunnk: ['index']
    }),
    new HtmlWebpackPlugin({
      template: 'app/service.pug',
      filename: 'service.html',
      chunnk: ['index']
    }),
    minifyPlugin
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
