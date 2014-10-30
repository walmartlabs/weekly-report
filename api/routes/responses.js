/*
 * Route for GET and POST of reponses
 *
 * @exports {function}
 * @param   {object}    server     server instance
 */
// var _ = require("lodash");

// var utils = require("../lib/utils");
var path = require("path");

var jade = require("jade");

module.exports = function (server) {
  // Post result of single survey
  // TODO: MAKE IT WORK!
  server.route({
    method: "POST",
    path: "/responses",
    handler: function (req, res) {
      res({});
    }
  });

  server.route({
    method: "GET",
    path: "/responses/{tokens}",
    handler: function (req, res) {
      var view = jade.compileFile(
        path.resolve(__dirname, "../views/response.jade"));

      var tokens = req.params.tokens.split("...");

      var models = req.server.plugins.sqlModels.models;
      // Get the surveys

      models.Response.findAll({ where: { token: tokens }})
        .then(function (responses) {
          if (responses.length === 0) {
            res("404 NOT FOUND").code(404);
          }

          res(view({}));
        }, function (err) {
          global.console.log(err);
          res(err);
        });
    }
  });
};
