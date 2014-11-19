/*
 * Weekly Reports Server. This module creates a Hapi server
 * instance with a live connection to a DB
 *
 * @exports {function}  Promise that resolves with server instance
 */
var _ = require("lodash");
var path = require("path");

var Good = require("good");
var Hapi = require("hapi");
var when = require("when");

var dbSequelized = require("./plugins/db-sequelized");
var responseRoutes = require("./routes/responses");
var surveyRoutes = require("./routes/surveys");

module.exports = function (options) {
  options = options || {};
  var dbOptions = options.dbOptions || {};

  return when.promise(function (resolve, reject) {
    var server = new Hapi.Server(process.env.PORT || 8000);

    // Add routes to server
    surveyRoutes(server);
    responseRoutes(server);

    // Add static routes
    server.route({
      method: "GET",
      path: "/assets/fonts/{param*}",
      handler: {
        directory: {
          path: path.resolve(__dirname, "../node_modules/font-awesome")
        }
      }
    });

    server.route({
      method: "GET",
      path: "/assets/images/{param*}",
      handler: {
        directory: {
          path: path.resolve(__dirname, "../app/assets/images")
        }
      }
    });

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
        // Either URL or database/user/pass
        url: process.env.DATABASE_URL || dbOptions.databaseUrl || null,
        // db/user/pass
        database: process.env.DATABASE || dbOptions.database || "",
        user: process.env.DATABASE_USER || dbOptions.user || "",
        pass: process.env.DATABASE_PASS || dbOptions.pass || "",

        // Everything else passed to sqlize as options
        // dbOptions.options will override ENV vars and defaults
        options: _.merge({
          dialect: process.env.DATABASE_DIALECT || "sqlite",
          storage: process.env.DATABASE_STORAGE || null,
          logging: process.env.SQLIZE_LOGGING || false
        }, dbOptions.options)
      }
    }], function (err) {
      if (err) {
        return reject(err);
      }

      resolve({
        server: server,
        createTables: function () {
          return server.plugins.sqlModels.models.sqlize.sync();
        }
      });
    });
  });
};
