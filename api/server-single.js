
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

getServer(null, function (err, server) {
  if (err) {
    return exitWithError(err);
  }

  server.start(function () {
    server.log("info", "Server running at: " + server.info.uri);
  });
});
