const { name } = require('./package.json');

module.exports = {
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
