const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractPlugin = new ExtractTextPlugin({
  filename: 'main.[chunkhash].css'
});

const providerPlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})

const cleanWebPackPlugin = new CleanWebpackPlugin(['dist'])

const babelOptions = {
  presets:  [
    [ 'es2015', { modules: false } ],
    [ 'es2017' ]
  ],
  plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread']
}

const entryConfig = {
  vendor: ['jquery'],
  index: [
    path.resolve(__dirname, 'app/index.js'),
    path.resolve(__dirname, 'app/sass/main.scss')
  ]
}

const outputConfig = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'bundle.[chunkhash].js',
}

const jsRules = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: babelOptions
    },
    {
      loader: 'eslint-loader'
    }
  ]
}

const tsRules = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: babelOptions
    },
    {
      loader: 'ts-loader',
      options: {
        'tsConfigFile': 'tsconfig.json'
      }
    },
    {
      loader: 'tslint-loader',
      options: {
        'configFile': 'tslint.json'
      }
    }
  ]
}

const sassRules = {
  test: /\.scss$/,
  exclude: /node_modules/,
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

const htmlRules = {
  test: /\.html$/,
  exclude: /node_modules/,
  use: ['html-loader']
}

const pugRules = {
  test: /\.pug$/,
  exclude: /node_modules/,
  use: [
    { loader: 'html-loader' },
    { loader: 'pug-html-loader',
      options: {
        name: '[name],[ext]'
      }
    }
  ]
}

const fontRules = {
  test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  exclude: '/app/images/',
  use: [
    {
      loader: 'file-loader',
      options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
    }
  ]
}

const imageRules = {
  test: /\.(jpg|png|ico|svg)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name],[ext]',
        outputPath: 'images/',
      }
    }
  ]
}
//const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({ })

module.exports = (env = {}) => {
  // Variables set by npm scripts in package.json
  const isProduction = env.production === true

  const minifyPlugin = new webpack.LoaderOptionsPlugin({
    minimize: (isProduction) ? true : false,
    debug: (isProduction) ? false : true
  })

  return {
    entry: entryConfig,
    output: outputConfig,

    devtool: (() => {
      return (isProduction) ? 'source-map' : 'cheap-module-eval-source-map'
    })(),

    module: {
      rules: [ tsRules, jsRules, sassRules, htmlRules, pugRules, fontRules, imageRules ]
    },

    plugins: [
      extractPlugin,
      providerPlugin,
      cleanWebPackPlugin,
      //uglifyJsPlugin,

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js'
      }),

      new HtmlWebpackPlugin({
        favicon: 'app/favicon.png',
        template: 'app/index.pug',
        filename: 'index.html',
        chunk: ['index']
      }),
      new HtmlWebpackPlugin({
        favicon: 'app/favicon.png',
        template: 'app/service.pug',
        filename: 'service.html',
        chunk: ['index']
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
  }
};
