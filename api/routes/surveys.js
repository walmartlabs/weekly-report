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

  // Create batch of surveys from array of survey objects
  server.route({
    method: "POST",
    path: "/surveys/batch",
    handler: function (req, res) {
      // TODO[6]: Verify data
      var surveys = req.payload;
      var models = req.server.plugins.sqlModels.models;

      // First create a batch number
      models.SurveyBatch.create()
        // Then create the survey records
        // and response records
        .then(function (batch) {
          var makeSurveys = when.all(_.map(surveys, function (survey) {
            return utils.createSurvey(_.extend(survey, {
              SurveyBatchId: batch.id
            }), models);
          }));

          // Return batch ID so records can be fetched with responses attached
          return when(batch.id).then(makeSurveys);
        })
        // Fetch all newly created surveys joined to new responses
        .then(function (batchId) {
          return models.Survey.findAll({
            where: {
              SurveyBatchId: batchId
            },
            include: [models.Response]
          });
        })
        // Respond with object containing
        // Array of newly created surveys
        // And array of email addresses and tokens to create links to responses
        .then(function (batch) {
          res({
            surveys: _.map(batch, function (survey) {
              return survey.dataValues;
            }),
            tokensByEmail: utils.tokenByEmailFromBatch(batch)
          });
        })
        .catch(utils.handleWriteErr(req, res));
    }
  });

  // Get all surveys and responses for a given batch number
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
        // Convert survey.responses to arrapy of dataValues
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
};
