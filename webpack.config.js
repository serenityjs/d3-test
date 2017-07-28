const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: path.join(__dirname, 'src'),
                query: {
                    presets: 'es2015',
                },
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: [
                    'style-loader?sourceMap',
                    'css-loader?sourceMap',
                    'sass-loader',
                ],
            }, {
                test: /\.json/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json-loader',
            }, {
                test: /\.html$/,
                loader: 'ignore-loader',
            }, {
                test: /\.png$/,
                loader: 'url-loader?limit=100000',
            }, {
                test: /\.jpg$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
    ],
    devServer: {
        inline: true,
        historyApiFallback: true,
        progress: true,
        colors: true,
        https: false,
        hot: false,
        port: 8888,
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map',
};
