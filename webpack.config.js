const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        'pagination': './src/pagination.ts',
        'pagination.min': './src/pagination.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Pagination',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                include: /\.min\.js$/,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],

                exclude: /node_modules/,
                // query: {
                //     declaration: false,
                // }
            }
        ]
    },
}