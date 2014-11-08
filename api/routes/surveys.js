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
      var batchId;

      // First create a batch number
      models.SurveyBatch.create()
        // Then create the survey records
        // and response records
        .then(function (batch) {
          batchId = batch.get("id");

          return when.all(_.map(surveys, function (survey) {
            return utils.createSurvey(_.extend(survey, {
              SurveyBatchId: batchId
            }), models);
          }));
        })

        // Fetch all newly created surveys joined to new responses
        // and create resonse object
        .then(function () {
          return utils.batchResponse(batchId, models);
        })
        .then(function (responseBody) {
          res(responseBody);
        })
        .catch(utils.handleWriteErr(req, res))
        .done();
    }
  });

  // Get all surveys and responses for a given batch number
  server.route({
    method: "GET",
    path: "/surveys/batch/{number}",
    handler: function (req, res) {
      var models = req.server.plugins.sqlModels.models;

      utils.batchResponse(req.params.number, models)
        .then(function (responseBody) {

          res(responseBody);
        })
        .catch(utils.handleWriteErr(req, res))
        .done();
    }
  });
};
