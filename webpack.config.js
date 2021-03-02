const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

function getPlugins(isProduction) {
  const basePlugins = [
    new HtmlWebpackPlugin({
      filename: __dirname + '/public/index.html',
      template: __dirname + '/index.html'
    }),
    new ForkTsCheckerWebpackPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, './debugger-web'),
      forceMode: 'production', // greatly reduces CPU usage and memcpy calls
      forceWatch: !isProduction,
      watchDirectories: isProduction
        ? []
        : [
            path.resolve(__dirname, './debugger'),
            path.resolve(__dirname, './gb')
          ]
    }),
    new FaviconsWebpackPlugin(__dirname + '/browser/assets/images/feather.svg')
  ]

  if (isProduction) {
    return [
      ...basePlugins,
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip'
      }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress'
      })
    ]
  }

  return [...basePlugins]
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './browser/main.tsx',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'main.js'
    },
    experiments: {
      syncWebAssembly: true
    },
    devServer: {
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.gb$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(otf|ttf)$/,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    plugins: getPlugins(isProduction),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.css']
    }
  }
}
