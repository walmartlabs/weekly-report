/**
 * Gulp file.
 */
var fs = require("fs");

var _ = require("lodash");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var gulp = require("gulp");
var gutil = require("gulp-util");
var clean = require("gulp-clean");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var livereload = require("gulp-livereload");
var mocha = require("gulp-mocha");
var nodemon = require("nodemon");
var open = require("open");
var path = require("path");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var webpack = require("webpack");

var buildCfg = require("./webpack.config.js");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// CSS/HTML Development Tasks
// ----------------------------------------------------------------------------
var options = {
  "port": 8000,
  "host": "localhost",
  "scssPath": "./app/scss/"
};

gulp.task("open-browser", function () {
  return open(path.join("http://" + options.host + ":" +
    options.port, "dev", "responses"));
});

var runCss = function () {
  return gulp.src(options.scssPath + "main.scss")
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest("./build/assets/css"));
};

gulp.task("css", runCss);

gulp.task("css-livereload", function () {
  return runCss().pipe(livereload());
});

gulp.task("clean", function () {
  return gulp.src("./build", {read: false})
      .pipe(clean());
});

gulp.task("server:dev", function (cb) {
  return nodemon({
    script: "node ./test/server-mock",
    ext: "js"
  })
  .on("start", cb);
});

// Create webpack task.
var _webpack = function (cfg) {
  var compiler = webpack(cfg); // Single compiler for caching.

  return function (done) {
    compiler.run(function (err, stats) {
      if (err) { throw new gutil.PluginError("webpack", err); }

      gutil.log("[webpack]", stats.toString({
        hash: true,
        colors: true,
        cached: false
      }));

      livereload.changed;
      done();
    });
  };
};

gulp.task("js", _webpack(buildCfg));

gulp.task("watch", function () {
  livereload.listen();

  gulp.watch(options.scssPath + "**/*.scss", ["css-livereload"]);
  gulp.watch("api/views/**/*.jade").on("change", livereload.changed);
  gulp.watch("app/js/**/*.js", ["js"]);
});

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
var jsSources = [
  "*.js",
  "api/**/*.js",
  "test/*.js"
];

var jsTestSources = [
  "test/api/**/*.js"
];

var jsAppSources = [
  "app/js/**/*.js"
];

var jshintCfg = _jshintCfg(".jshintrc.json");

gulp.task("jshint:backend", function () {
  return gulp
    .src(jsSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      node: true,
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:backend-test", function () {
  return gulp
    .src(jsTestSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      node: true,
      predef: [
        "after",
        "describe",
        "before",
        "beforeEach",
        "afterEach",
        "it",
        "sinon",
        "expect",
        "test"
      ].concat(jshintCfg.predef)
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:frontend", function () {
  return gulp
    .src(jsAppSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      browser: true,
      predef: [
        "require"
      ]
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", [
  "jshint:backend",
  "jshint:backend-test",
  "jshint:frontend"
]);

gulp.task("jscs", function () {
  return gulp
    .src([].concat(
      jsSources,
      jsAppSources,
      jsTestSources
    ))
    .pipe(jscs());
});

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------
gulp.task("mocha", function () {
  // Include setup.
  require("./test/setup");

  return gulp
    .src(["test/**/*.spec.js"])
    .pipe(mocha({
      ui: "bdd",
      reporter: "spec"
    }))
    .on("error", function (err) {
      throw err;
    });
});

// ----------------------------------------------------------------------------
// Nodemon
// ----------------------------------------------------------------------------
gulp.task("server:dev", function () {
  nodemon({
    script: "./test/server-mock.js",
    ext: "js",
    ignore: ["*.js", "./app/**/*.js", "./build/**/*.js"]
  });
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("build", function () {
  return runSequence("clean", ["js", "css"]);
});

gulp.task("start", function () {
  runSequence("build", "server:dev", "open-browser", "watch");
});

gulp.task("check:dev",  ["jshint", "jscs", "mocha"]);
gulp.task("check",      ["jshint", "jscs", "mocha"]);
gulp.task("default",    ["check", "build"]);
