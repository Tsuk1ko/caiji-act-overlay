module.exports = {
  productionSourceMap: false,
  publicPath: './',
  assetsDir: 'assets',
  configureWebpack: {
    externals: {
      lodash: '_',
      vue: 'Vue',
    },
  },
};
