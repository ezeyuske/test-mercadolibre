const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');


// Configuration
const { argv, env } = process;
const NODE_ENV = env.NODE_ENV || 'development';

const config = {
	mode: NODE_ENV,
	entry: {
		main: ['babel-polyfill', './dev/main.js']
	},
	output: {
		path: path.resolve(__dirname, './public'),
		filename: 'js/[name].js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/],
				use: [{
					loader: 'babel-loader',
					options: {
						presets: [
							['env', { modules: false }],
							'react',
							'flow'
						],
						plugins: [
							'transform-object-rest-spread',
							'transform-class-properties',
							'transform-decorators'
						]
					}
				}],
			}, {
				test: /\.(css|scss|sass)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [
									autoprefixer({
										browsers: '> 1%, last 2 versions, iOS >= 8'
									})
								]
							}
						}, {
							loader: 'sass-loader',
							options: {
								data: '@import "variables"; @import "mixins";',
								includePaths: [
									path.resolve(__dirname, './dev/styles/includes'),
									path.resolve('./node_modules')
								]
							}
						}
					]
				})
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			path.resolve(__dirname, './dev'),
			path.resolve('./node_modules')
		]
	},
	devServer: {
		port: 3001,
		open: true,
		proxy: {
			'/api': 'http://localhost:3007'
		}
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin({
			filename: 'styles/[name].css'
		})
	],
	stats: {
		colors: true
	},
	devtool: 'source-map'
};


// Watch
if (NODE_ENV === 'development') {
	config.watchOptions = {
		poll: true
	};
}


// Build
if (NODE_ENV === 'production') {
	// OUTPUT
	config.output.path = path.join(__dirname, './build');

	// PLUGINS
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin({
			filename: 'styles/[name].css'
		})
	);
}

module.exports = config;
