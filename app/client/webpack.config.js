const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: [
		'./public/index.js',
		'webpack-dev-server/client?http://localhost:7000',
		'webpack/hot/dev-server',
	],
	mode: 'development',
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: { presets: ['@babel/env'] },
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/dist/',
		filename: 'bundle.js',
	},
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		port: 7000,
		publicPath: 'http://localhost:7000/dist/',
		hot: true,
		contentBase: './public',
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
};
