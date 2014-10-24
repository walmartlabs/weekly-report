/**
 * Gulp file.
 */
var fs = require("fs");

var _ = require("lodash");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var connect = require("connect");
var gulp = require("gulp");
var clean = require("gulp-clean");
var http = require("http");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var livereload = require("gulp-livereload");
var mocha = require("gulp-mocha");
var nodemon = require("nodemon");
var open = require("open");
var path = require("path");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var serveStatic = require("serve-static");

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
var app = connect()
  .use(serveStatic(__dirname));

var options = {
  "port": 8000,
  "host": "localhost",
  "scssPath": "./app/scss/"
};

gulp.task("connect", function () {
  return http.createServer(app).listen(8000);
});

gulp.task("open-browser", function () {
  return open(path.join("http://" + options.host + ":" +
    options.port, "build"));
});

var css = function () {
  return gulp.src(options.scssPath + "main.scss")
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest("./build/assets/css"));
};

gulp.task("css", css);

gulp.task("copy", function () {
  gulp.src("./app/js/**/*.js")
    .pipe(gulp.dest("./build/assets/js"));
});

gulp.task("clean", function () {
  return gulp.src("./build", {read: false})
      .pipe(clean());
});

gulp.task("watch", function () {
  livereload.listen();
  gulp.watch(options.scssPath + "**/*.scss", ["css-live"])
    .on("change", livereload.changed);
  gulp.watch("./src/js/**/*.js", ["copy"])
    .on("change", livereload.changed);
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

var jsMockSources = [
  "api/mock/**/*.js"
];

var jsAppSources = [
  "app/js/**/*.js"
];

var jshintCfg = _jshintCfg(".jshintrc.json");

gulp.task("jshint:backend", function () {
  gulp
    .src(jsSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      node: true,
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:backend-test", function () {
  gulp
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
  gulp
    .src(jsAppSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      browser: true,
      jquery: true
    })))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint:mock", function () {
  gulp
    .src(jsMockSources)
    .pipe(jshint(_.merge({}, jshintCfg, {
      node: true,
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
  gulp
    .src([].concat(
      jsSources,
      jsAppSources,
      jsTestSources
    ))
    .pipe(jscs());
});

gulp.task("jscs:mock", function () {
  gulp
    .src(jsMockSources)
    .pipe(jscs());
});

// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------
gulp.task("mocha", function () {
  // Include setup.
  require("./test/setup");

  gulp
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
  nodemon({ script: "./api/server.js" });
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("build", function () {
  runSequence("clean", ["css", "copy"]);
});

gulp.task("start", function () {
  runSequence("build", "cli", "open-browser", "connect", "watch");
});

gulp.task("check:dev",  ["jshint", "jscs", "mocha"]);
gulp.task("check",      ["jshint", "jshint:mock",
                         "jscs", "jscs:mock", "mocha"]);
gulp.task("default",    ["check", "build"]);
