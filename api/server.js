/*
 * Weekly Reports Server. This module creates a Hapi server
 * instance and creates tables in database if not existing
 *
 * @exports {function}  With server passed to callback
 */
var path = require("path");

var _ = require("lodash");
var dbSequelized = require("./plugins/db-sequelized");
var Good = require("good");
var Hapi = require("hapi");
var surveyRoutes = require("./routes/surveys");
var responseRoutes = require("./routes/responses");

var getServer = function (options, callback) {
  // TODO[5]: Recluster
  var server = Hapi.createServer("localhost", process.env.PORT || 8000);

  // Add routes to server
  surveyRoutes(server);
  responseRoutes(server);

  // Add static route
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../build")
      }
    }
  });


  options = options || {};

  // Add sequelize models
  server.pack.register([{
    // Add Good logger
    // TODO[4]: Build Winston into plugin
    plugin: Good
  }, {
    plugin: dbSequelized,
    options: {
      server: server,
      database: process.env.DATABASE || options.database || "",
      user: process.env.DATABASE_USER || options.user || "",
      pass: process.env.DATABASE_PASS || options.pass || "",
      dialect: process.env.DATABASE_DIALECT || options.dialect || "sqlite",
      storage: process.env.DATABASE_STORAGE || options.storage || null,
      logging: false
    }
  }], function (err) {
    if (err) { return callback(err); }

    // Build tables if not already present in DB
    var models = server.plugins.sqlModels.models;
    models
      .sqlize
      .sync()
      .then(function () {
        if (!_.isFunction(callback)) {
          return callback(new Error("Callback is not a function"));
        }

        callback(null, server);
      }, function (err) {
        callback(err);
      });
  });
};

module.exports = getServer;
