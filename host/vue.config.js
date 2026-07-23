module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: '../dist',
  devServer: {
    port: Number(process.env.VUE_APP_PORT),
    open: true,
  },
};
