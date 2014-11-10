var Good = require("good");
var goodConsole = require("good-console");
var moment = require("moment");

var LOG_PATH = "./logs/log-" + moment().format("YYYYMMDD");

// File reporter to log everything
var fileReporter = new Good.GoodFile(LOG_PATH, {
  ops: "*",
  request: "*",
  log: "*",
  error: "*"
});

// Setup console reporter
// Default args
var consoleArgs = [{
  log: "*",
  error: "*"
}];

// Set args for test env
if (process.env.NODE_ENV === "test") {
  consoleArgs = [{
    log: ["error"],
    error: "*"
  }];
}

var consoleReporter = {
  reporter: goodConsole,
  args: consoleArgs
};

module.exports = [consoleReporter, fileReporter];
