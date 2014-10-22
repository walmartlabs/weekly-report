/*
 * Weekly Reports Server
 *
 * @exports {function}  With server passed to callback
 */
var Hapi = require("hapi");
var Sqlize = require("sequelize");

var callback;
var server = Hapi.createServer("localhost", 8000);

if (!module.parent) {
  server.start(function () {
    global.console.log("Server running at: ", server.info.uri);
  });
}

// Setup sql connection
var sqlize = new Sqlize(null, null, null, {
  dialect: "sqlite",
  storage: "./db/dev.sqlite3",
  logging: false,
  // Create tables and db if non existing
  sync: { force: true }
});

// add models
var sqlSchema = require("./sql-schema")(sqlize);

// Require in routes
require("./routes/surveys")(server, sqlSchema);

// Connect
sqlize
  .authenticate()
  .success(function () {
    sqlize
      .sync()
      .success(function () {
        if (typeof callback === "function") {
          callback(server);
        }
      })
      .error(function (err) {
        throw err;
      });
  })
  .error(function (err) {
    throw err;
  });

module.exports = function (cb) {
  callback = cb;
};
