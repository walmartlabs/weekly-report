/**
 * Clustered server.
 *
 * See: https://github.com/doxout/recluster
 */
var path = require("path");

var recluster = require("recluster");
var cluster = recluster(path.join(__dirname, "server-single.js"));

// Start cluster.
cluster.run();

// Set reload.
process.on("SIGUSR2", function () {
  global.console.log("Got SIGUSR2, reloading cluster...");
  cluster.reload();
});

global.console.log("Spawned cluster, kill -s SIGUSR2",
  process.pid, "to reload");
