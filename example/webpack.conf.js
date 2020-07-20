/*
 * @Author: Yang Lin
 * @Description: webpack 配置文件
 * @Date: 2020-07-06 20:08:07
 * @LastEditTime: 2020-07-20 20:45:16
 * @FilePath: f:\sourcecode\md-vue-loader\example\webpack.conf.js
 */ 
const path = require('path');
const resolvePath = targetPath => path.resolve(__dirname, targetPath);
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: resolvePath('./entry.js'),
    output: {
        filename: '[name].boundle.js',
        path: resolvePath('../dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        },{
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory',
            exclude: /node_modules/
        },{
            test: /\.md$/,
            use: [{
                loader: 'vue-loader'
            },{
                loader: 'md-vue-loader',
                options: {
                    aaa: 'bbb'
                }
            }]
        },{
            test: /\.(sa|sc|c)ss$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader'
            ]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'md loader',
            filename: resolvePath('../dist/index.html'),
            template: resolvePath('./index.html')
        })
    ],
    resolve: {
        extensions: ['.vue', '.js', '.md', '.ts'],
        modules: ['node_modules','example']
    },
    resolveLoader: {
        alias: {
            'md-vue-loader': resolvePath('../lib/index.js')
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        stats: "minimal",
        contentBase: __dirname
    },
    mode: 'development'
};