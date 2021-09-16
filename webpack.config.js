const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const WebpackConcatPlugin = require('webpack-concat-files-plugin');
const CopyPlugin = require("copy-webpack-plugin");

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
    libraryExport: 'default',
    library: 'Pagination',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
    }
    )],
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
  plugins: [
    new WebpackConcatPlugin({
      bundles: [
        {
          dest: './dist/pagination.d.ts',
          src: './src/*.d.ts',
        },
      ],
    }),

    new CopyPlugin({
      patterns: [
        { from: "src/css" },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
}
