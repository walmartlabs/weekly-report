/*
 * Weekly Reports Server
 *
 * @exports {function}  With server passed to callback
 */
var Hapi = require("hapi");

var callback;
var server = Hapi.createServer("localhost", 8000);

require("./routes/surveys")(server);

server.pack.register({
  plugin: require("./plugins/db-sequelized"),
  options: {
    database: "",
    user: "",
    pass: "",
    dialect: "sqlite",
    storage: "./db/dev.sqlite3",
    logging: false
  }
}, function (err) {
  if (err) { throw err; }

  var models = server.plugins.sqlModels.models;
  models
    .sqlize
    .sync()
    .complete(function (err) {
      if (err) { throw err[0]; }

      if (!module.parent) {
        server.start(function () {
          global.console.log("Server running at: ", server.info.uri);
        });
      }

      if (typeof callback === "function") {
        callback(server);
      }
    });
});

module.exports = function (cb) {
  callback = cb;
};
