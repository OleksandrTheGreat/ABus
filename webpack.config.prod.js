const common = require('./webpack.config.common.js');

module.exports = {
  entry: common.getEntry(),
  output: common.getOutput(),
  module: common.getModule({ tsconfig: "tsconfig.prod.json" }),
  resolve: common.getResolve(),
  plugins: common.getPlugins(),
  devtool: "source-map",
  bail: true,
  cache: false
};
