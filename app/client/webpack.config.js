const path = require('path');  // Add this missing import
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './public/index.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/' // Add this line
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,  // Revert to original port with cleanup
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
        bypass: (req) => {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
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
                auto: true, // This enables modules for all CSS files
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
};
