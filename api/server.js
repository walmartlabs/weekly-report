
var Hapi = require("hapi");

var server = Hapi.createServer("localhost", 8000);

if (!module.parent) {
  server.start(function () {
    global.console.log("Server running at: ", server.info.uri);
  });
}

// Require in routes
require("./routes/reports")(server);

module.exports = server;
