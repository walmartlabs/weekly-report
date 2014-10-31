var _ = require("lodash");

var getServer = require("./server.js");

var exitWithError = function (err) {
  var errData = {
    stack: err.stack,
    errMessage: err.message,
    name: err.name
  };

  // TODO[#4] Winston with uncaught exceptions handler
  global.console.log(JSON.stringify(errData, null, 2));
  process.exit(1);
};

var liveServer = function (options, callback) {
  if (!_.isFunction(callback)) {
    exitWithError(new Error("callback not a function"));
  }

  getServer(options, function (err, server) {
    if (err) {
      return callback(err);
    }

    server.start(function () {
      server.log("info", "Server running at: " + server.info.uri);

      callback(null, server);
    });
  });
};

// Start server if this is executed module
if (!module.parent) {
  liveServer(null, function (err) {
    if (err) {
      exitWithError(err);
    }
  });
}

module.exports = liveServer;
