var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
// console.log(path.join(__dirname, './public/assets'));
module.exports = {
  entry: {
    index: path.join(__dirname, '../public/js/index.js')
  },
  output: {
    publicPath: '',
    path: path.join(__dirname, '../public/build/'),
    filename: '[name].bundle.js'
  },
  module: {
      loaders: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: [/node_modules/,/libs/]
      // },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader?presets[]=es2015!eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.json|\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
      }, {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
      }, {
        test: /\.png/,
        exclude: /(images)/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
      }, {
        test: /\.png$/,
        include: /(images)/,
        loader: 'file-loader?name=/images/[name].[ext]'
      }, {
        test: /\.ico$/,
        include: /(images)/,
        loader: 'url-loader?limit=10000&mimetype=image/x-icon'
      }, {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'postcss', 'sass')
      }
    ]
  },
  sassLoader: {
    includePaths: [path.join(__dirname, '../public/css')]
  },
  postcss: function () {
    return [autoprefixer];
  },
  plugins: [
    // new ExtractTextPlugin("styles.css")
    new ExtractTextPlugin('app.css')
  ]
};
