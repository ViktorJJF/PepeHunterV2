const path = require('path');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    node: {
      global: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        global: 'window',
      }),
    ],
  },
  lintOnSave: true,
  outputDir: path.resolve(__dirname, '../public'),
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
};
