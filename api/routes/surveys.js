/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 */
var _ = require("lodash");
var when = require("when");
var utils = require("../lib/utils");
var Joi = require("joi");
var moment = require("moment");

module.exports = function (server) {

  // Create batch of surveys from array of survey objects
  server.route({
    method: "POST",
    path: "/surveys/batch",
    handler: function (req, res) {
      var surveys = req.payload;
      var models = req.server.plugins.sqlModels.models;
      var batchId;

      // Wrap in transaction. If promise chain err's
      // then transaction rolled back automatically
      // If succeeds then committed
      models.sqlize.transaction(function () {
        // First create a batch number
        return models.SurveyBatch.create()
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
            return res(responseBody);
          });
      })
        // If catch then transaction will have been rolled back
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

  // Get all surveys and responses for a given periodEnd date
  server.route({
    method: "GET",
    path: "/surveys/{periodEnd}",
    handler: function (req, res) {
      var models = req.server.plugins.sqlModels.models;
      var periodEnd = moment(req.params.periodEnd).format("YYYYMMDD");

      models.Survey.findAll({
        where: {
          periodEnd: periodEnd
        },
        include: [models.Response]
      })
      .then(function (responseBody) {
        res(_.map(responseBody, function (instance) {
          return instance.toJSON();
        }));
      })
      .catch(utils.handleWriteErr(req, res));
    },
    config: {
      validate: {
        params: {
          periodEnd: Joi.date().format("YYYYMMDD")
        }
      }
    }
  });
};
