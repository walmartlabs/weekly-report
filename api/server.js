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
    database: process.env.DATABASE || "",
    user: process.env.DATABASE_USER || "",
    pass: process.env.DATABASE_PASS || "",
    dialect: process.env.DATABASE_DIALECT || "sqlite",
    storage: process.env.DATABASE_STORAGE || null,
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
