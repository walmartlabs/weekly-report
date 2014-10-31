/*
 * Route for GET and POST of reponses
 *
 * @exports {function}
 * @param   {object}    server     server instance
 */
var path = require("path");

var _ = require("lodash");
var jade = require("jade");
var when = require("when");

var utils = require("../lib/utils");

module.exports = function (server) {
  // Post result of single survey
  server.route({
    method: "POST",
    path: "/responses",
    handler: function (req, res) {
      // TODO[6]: Validate data
      var models = req.server.plugins.sqlModels.models;
      var data = req.payload;

      // Get response record, populate, save
      models.Response.find({ where: { token: data.token }})
        .then(function (response) {
          // No matching records
          if (!response) {
            res().code(404);
          }

          // Stringify the new fields
          var postData = _.chain(data)
            .pick([
              "accomplishments",
              "blockers",
              "moralePicker",
              "privateFeedback"
            ])
            .mapValues(function (value) {
              return JSON.stringify(value);
            })
            .value();

          // Add fields to be saved
          _.extend(response.dataValues, postData, {
            completedAt: new Date()
          });

          return response.save();
        })
        .then(res)
        .catch(utils.handleWriteErr(req, res));
    }
  });

  server.route({
    method: "GET",
    path: "/responses/{tokens}",
    handler: function (req, res) {
      var models = req.server.plugins.sqlModels.models;

      var tokens = req.params.tokens.split("...");
      models.Response.findAll({ where: { token: tokens }})
      .then(function (responses) {
        var getSurveys = _.map(responses, function (response) {
          return utils.attachSurvey(response);
        });

        return when.all(getSurveys);
      })
      .then(function (responses) {
        // Must have sent a bad link
        if (responses.length === 0) {
          return res().code(404);
        }

        // Prepare view data
        var data = {
          name: responses[0].get("email"),
          responses: _.map(responses, function (response) {
            return {
              completed: !!response.get("completedAt"),
              projectName: response.survey.get("projectName"),
              token: response.get("token")
            };
          })
        };

        // Compose view and send
        var viewFn = jade.compileFile(
          path.resolve(__dirname, "../views/response.jade"));

        res(viewFn(data));
      })
      .catch(utils.handleWriteErr(req, res));
    }
  });
};
