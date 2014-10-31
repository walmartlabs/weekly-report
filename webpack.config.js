/**
 * Webpack configuration
 */

var path = require("path");
var webpack = require("webpack");

module.exports = {
  cache: true,
  context: path.join(__dirname, "app"),
  entry: "./js/app",
  output: {
    path: path.join(__dirname, "build", "assets"),
    filename: "bundle.js"
  },
  optimize: {
    minimize: true
  },
  module: {
    loaders: [
      { test: /\.hbs$/, loader: "handlebars-loader" }
    ]
  },
  resolve: {
    alias: {
      "underscore": "lodash/build/lodash.underscore"
    }
  },
  plugins: [
    // Manually do source maps to use alternate host.
    new webpack.SourceMapDevToolPlugin(
      "bundle.js.map",
      "\n//# sourceMappingURL=http://127.0.0.1:3001/build/[url]")
  ]
};
