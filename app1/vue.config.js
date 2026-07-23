const { name } = require('./package.json');

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: `../dist/${process.env.VUE_APP_NAME}`,
  devServer: {
    port: Number(process.env.VUE_APP_PORT),
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
