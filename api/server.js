
var Hapi = require("hapi");

var server = Hapi.createServer("localhost", 8000);

server.start(function () {
  global.console.log("Server running at: ", server.info.uri);
});

// Require in routes
require("./routes/reports")(server);
