/*
 * Weekly Reports Server. This module creates a Hapi server
 * instance with a live connection to a DB
 *
 * @exports {function}  Promise that resolves with server instance
 */
var path = require("path");

var Good = require("good");
var Hapi = require("hapi");
var utils = require("./lib/utils");
var when = require("when");

var dbSequelized = require("./plugins/db-sequelized");
var responseRoutes = require("./routes/responses");
var surveyRoutes = require("./routes/surveys");

var SHUTDOWN_WAIT_TIME = 5000;

module.exports = function (options) {
  options = options || {};

  return when.promise(function (resolve, reject) {
    var server = Hapi.createServer("localhost", process.env.PORT || 8000);

    // Uncaught exceptions. Any exception in route handlers that are not
    // handled (only sequelize promise chain exceptions handled)
    server.on("internalError", utils.handleInternalErr({
      server: server,
      waitTime: SHUTDOWN_WAIT_TIME
    }));

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

    // Get reporters if specified in options
    var goodOptions;
    if (options.reporters) {
      goodOptions = {
        reporters: options.reporters
      };
    }

    // Add sequelize models
    server.pack.register([{
      // Add Good logger
      plugin: Good,
      options: goodOptions
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
      if (err) {
        return reject(err);
      }

      resolve(server);
    });
  });
};
