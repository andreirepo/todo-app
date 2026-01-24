const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Safe environment variable handling for Docker
const getEnvVar = (key, defaultValue) => {
  // If running in Docker, process.env[key] is set via ARG/ENV
  if (process.env.NODE_ENV === 'production' && process.env[key]) {
    return process.env[key];
  }
  
  // For local development, load from .env files
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) });
    require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  }
  
  return process.env[key] || defaultValue;
};

const API_URL = getEnvVar('API_URL', '/api');
const BASE_URL = getEnvVar('BASE_URL', '/');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './public/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: BASE_URL,
    clean: true
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
        changeOrigin: true,
      }
    },
    client: {
      overlay: {
        warnings: false,
      }
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(API_URL),
    })
  ],
};