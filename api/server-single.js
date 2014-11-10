var _ = require("lodash");
var utils = require("./lib/utils");
var when = require("when");

var serverPromise = require("./server");
var reporters = require("./logger-config");

var exitWithError = function (err) {
  var errData = utils.logMeta({
    stack: err.stack,
    errMessage: err.message,
    name: err.name,
    msg: "Uncaught exception"
  });

  global.console.log(errData);
  process.exit(1);
};

// Create promise for started server
// Exit process if fails
var liveServer = function (options) {
  options = _.extend({
    reporters: reporters
  }, options || {});

  return when.promise(function (resolve) {
    var server;

    serverPromise(options)
      .then(function (newServer) {
        // Save server instance
        server = newServer;

        // Create database tables if do not exist
        return server.plugins.sqlModels.models.sqlize.sync();
      })
        // Start up the server
      .then(function () {
        return when.promise(function (resolveStart) {
          server.start(function () {
            server.log("info", utils.logMeta({
              msg: "Server running",
              uri: server.info.uri
            }));
            resolveStart();
          });
        });
      })
      .catch(exitWithError)
      .done(function () {
        resolve(server);
      });
  });
};

// Start server if this is executed module
if (!module.parent) {
  liveServer().done();
}

module.exports = liveServer;
