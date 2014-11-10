var Good = require("good");
var goodConsole = require("good-console");
var moment = require("moment");

var LOG_PATH = process.env.LOG_PATH ||
  "./logs/log-" + moment().format("YYYYMMDD");

// Log to file FALSE by default
var LOG_FILE = process.env.LOG_FILE || "false";

if (LOG_FILE !== "false" && LOG_FILE !== "true") {
  throw new Error("LOG_FILE env variable must be \"true\" or \"false\"");
}

var reporters = [];

if (LOG_FILE) {
  reporters.push(new Good.GoodFile(LOG_PATH, {
    ops: "*",
    request: "*",
    log: "*",
    error: "*"
  }));
}

// Setup console reporter
// Default args
var consoleArgs = [{
  log: "*",
  error: "*",
  request: "*"
}];

// Set args for test env
if (process.env.NODE_ENV === "test") {
  consoleArgs = [{
    log: ["error"],
    error: "*"
  }];
}

reporters.push({
  reporter: goodConsole,
  args: consoleArgs
});

module.exports = reporters;
