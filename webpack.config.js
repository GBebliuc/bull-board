/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const devServerPort = 9001
const basePath = '<%= basePath %>'
const pkg = require('./package.json')

module.exports = {
  mode: 'development',
  bail: true,
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  entry: ['./src/ui/index.tsx'],
  output: {
    path: path.resolve(__dirname, './static'),
    filename: `[name]${isProd ? '.[contenthash]' : ''}.js`,
    publicPath: `${
      isProd ? basePath : `http://localhost:${devServerPort}`
    }/static/`,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: isProd
                  ? '[hash:base64:6]'
                  : '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
        ],
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                !isProd && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [isProd && `...`, isProd && new CssMinimizerPlugin()].filter(
      Boolean,
    ),
    chunkIds: 'named',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      ['process.env.APP_VERSION']: JSON.stringify(pkg.version),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, './dist/ui/index.ejs'),
      template: './src/ui/index.ejs',
      templateParameters: {
        basePath,
      },
    }),
    new ForkTsCheckerWebpackPlugin(),
    !isProd && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    proxy: {
      '/ui': 'http://localhost:3000',
    },
    compress: true,
    writeToDisk: true,
    hot: true,
    port: devServerPort,
    open: true,
    openPage: 'ui',
  },
}
