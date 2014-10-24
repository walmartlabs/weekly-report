/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 * @param   {object}    sqlSchema  models of sqlize instance
 */
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();

module.exports = function (server) {

  // Create new survey
  server.route({
    method: "POST",
    path: "/surveys",
    handler: function (req, res) {
      var survey = req.payload;
      var models = req.server.plugins.sqlModels.models;
      // TODO: Verify data
      // First insert to Survey table
      models.Survey.create(survey)
        // Second add record for each email address
        .then(function (surveyRecord) {
          var responses = _.map(survey.emails, function (email) {
            return {
              token: chance.hash({ length: 15 }),
              email: email,
              SurveyId: surveyRecord.id
            };
          });
          models.Response.bulkCreate(responses)
            .then(function () {
              res({
                newSurvey: surveyRecord,
                msg: "New survey and empty responses created"
              });
            }, function (err) {
              global.console.log("failed on answer", err);
              server.log("warning", err);
              res({
                err: err,
                msg: "Failed to create empty responses"
              });
            });
        }, function (err) {
          server.log("warning", err);
          global.console.log("failed on survey", err);
          res({
            err: err,
            msg: "Failed to create new survey"
          });
        });
    }
  });
};
