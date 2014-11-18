var _ = require("lodash");
var fs = require("fs");
var sass = require("node-sass");
var webpack = require("webpack");

var buildCfg = require("./webpack.config.js");

var css = sass.renderSync({
  file: "./app/scss/main.scss",
  outputStyle: "compressed"
});

fs.writeFileSync("./build/assets/css/main.css", css);

var compiler = webpack(_.merge({}, buildCfg, {
  optimize: {
    minimize: true
  }
}));

compiler.run(function (err, stats) {
  if (err) { throw err; }

  global.console.log("webpack", stats.toString({
    hash: true,
    colors: true,
    cached: false
  }));
});
