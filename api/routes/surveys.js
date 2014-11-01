/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 */
var _ = require("lodash");
var when = require("when");
var utils = require("../lib/utils");

module.exports = function (server) {

  // Create new surveys
  server.route({
    method: "POST",
    path: "/surveys/batch",
    handler: function (req, res) {
      // TODO[6]: Verify data
      var surveys = req.payload;
      var models = req.server.plugins.sqlModels.models;

      // First create a batch number
      models.SurveyBatch.create()
        .then(function (batch) {
          return when.all(_.map(surveys, function (survey) {
            return utils.createSurvey(_.extend(survey, {
              SurveyBatchId: batch.id
            }), models);
          }));
        })
        .then(function (surveys) {
          res(_.map(surveys, function (survey) {
            return survey.dataValues;
          }));
        })
        .catch(utils.handleWriteErr(req, res));
    }
  });

  // Get survey and array of object of response tokens by email
  server.route({
    method: "GET",
    path: "/surveys/batch/{number}",
    handler: function (req, res) {
      var models = req.server.plugins.sqlModels.models;

      models.Survey.findAll({
        where: {
          SurveyBatchId: req.params.number
        },
        include: [models.Response]
      })
     .then(function (surveys) {
        // Convert survey.responses to array of dataValues
        _.each(surveys, function (survey) {

          survey.responses = _.map(survey.responses, function (response) {
            return response.dataValues;
          });
        });

        res(surveys);
      })
      .catch(utils.handleWriteErr(req, res));
    }
  });

  // Get survey and array of object of response tokens by email
  server.route({
    method: "GET",
    path: "/surveys/{number}",
    handler: function (req, res) {
      var models = req.server.plugins.sqlModels.models;
      var surveyRecord;
      models.Survey.find(req.params.number)
        .then(function (survey) {
          surveyRecord = survey;
          return surveyRecord.getResponses();
        })
        .then(function (responses) {
          var responseDataArray = _.map(responses, function (response) {
            return response.dataValues;
          });

          res({
            survey: surveyRecord.dataValues,
            responses: responseDataArray
          });
        });
    }
  });
};
