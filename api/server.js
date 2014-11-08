/*
 * Weekly Reports Server. This module creates a Hapi server
 * instance with a live connection to a DB
 *
 * @exports {function}  Promise that resolves with server instance
 */
var path = require("path");

var _ = require("lodash");
var dbSequelized = require("./plugins/db-sequelized");
var Good = require("good");
var Hapi = require("hapi");
var surveyRoutes = require("./routes/surveys");
var responseRoutes = require("./routes/responses");
var when = require("when");

module.exports = function (options) {
  return when.promise(function (resolve, reject) {
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

    var goodOptions;

    // Set logging for testing (only log errors)
    if (process.env.NODE_ENV === "test") {
      var reporter = new Good.GoodConsole();

      // Only log "log" events that are not info level
      reporter._filter = function (event, eventData) {
        if (eventData.event === "log" && !_.contains(eventData.tags, "info")) {
          return true;
        }
        return false;
      };

      goodOptions = {
        reporters: [reporter]
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
