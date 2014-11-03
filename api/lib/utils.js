/**
* Utility functions.
 *
 * @type {Object}
 */

/**
 * Logs and responds to err from writing to DB.
 *
 * @param {object}  req   The Hapi request object
 * @param {object}  res   The Hapi response object
 * @param {object}  err   The err object resulting from failed write to DB
 * @param {string}  msg   The message to send with response
 */
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();
var when = require("when");

// For use in .catch.
// Log error and exit process
var handleWriteErr = function (req, res) {
  return function (err) {
    try {
      req.server.log("error", {
        stack: err.stack,
        errMessage: err.message,
        name: err.name
      });

      res(err.message).code(500);
    } catch (e) {
      global.console.log.error(err);
    } finally {
      process.exit(1);
    }
  };
};

// Creates a survey record and then creates all response records
var createSurvey = function (surveyData, models) {
  return when.promise(function (resolve, reject) {
    var surveyRecord;

    // Create survey record
    models.Survey.create(surveyData)
      // Add record for each email address
      .then(function (newRecord) {
        surveyRecord = newRecord;
        var responses = _.map(surveyData.emails, function (email) {
          return {
            token: chance.hash({ length: 15 }),
            email: email,
            SurveyId: surveyRecord.id
          };
        });

        return models.Response.bulkCreate(responses);
      })
      // Finally respond to client with new survey record
      .then(function () {
        resolve(surveyRecord);
      })
      .catch(reject);
  });
};

// From array of survey records with nested response records
// will return array of objects, one for each email address
// containing the tokens for that address
var tokenByEmailFromBatch = function (batch) {
  return _.chain(batch)
    .map(function (survey) {
      return survey.Responses;
    })
    .flatten()
    .groupBy("email")
    .map(function (responses) {
      var tokens =  _.map(responses, function (response) {
        return response.get("token");
      });

      return {
        email: responses[0].email,
        tokens: tokens
      };
    })
    .value();
};

module.exports = {
  createSurvey: createSurvey,
  handleWriteErr: handleWriteErr,
  tokenByEmailFromBatch: tokenByEmailFromBatch
};
