const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "umd",
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  externals: {
    react: 'react'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(ts|tsx)?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.svg$/i,
      //   issuer: /\.[jt]sx?$/,
      //   use: ['@svgr/webpack'],
      // },
      {
        test: /\.(jpe?g|svg|gif|pdf|mp3)$/,
        // test: /\.(jpe?g|gif|pdf|mp3)$/,
        // alternative old plugin. Depends on representation of files in browsers
        // use: ['file-loader']
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
}
