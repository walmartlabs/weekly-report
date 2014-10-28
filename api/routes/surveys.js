/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 */
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();

var utils = require("../lib/utils.js");

module.exports = function (server) {
  var surveyRecord;

  // Create new survey
  server.route({
    method: "POST",
    path: "/surveys",
    handler: function (req, res) {
      var survey = req.payload;
      var models = req.server.plugins.sqlModels.models;

      // TODO[6]: Verify data
      // First insert to Survey table
      models.Survey.create(survey)

        // Second add record for each email address
        .then(function (newRecord) {
          surveyRecord = newRecord;
          var responses = _.map(survey.emails, function (email) {
            return {
              token: chance.hash({ length: 15 }),
              email: email,
              SurveyId: surveyRecord.id
            };
          });

          return models.Response.bulkCreate(responses);
        }, utils.handleWriteErr(
          req, res, "Failed to create new survey record")
        )

        // Finally respond to client with new survey record
        .then(function () {
          res({
            newSurvey: surveyRecord,
            msg: "New survey and empty responses created"
          });
        }, utils.handleWriteErr(
            req, res, "Failed to create new response records")
        );
    }
  });
};
