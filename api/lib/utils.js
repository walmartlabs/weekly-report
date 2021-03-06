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
var os = require("os");
var when = require("when");

var logMeta = function (obj) {
  return _.merge({
    os: {
      hostname: os.hostname()
    },
    workerId: process.env.WORKER_ID
  }, obj);
};

// For sqlize promise chains. Will cause hapi to send 500 with default
// message and log data.
var handleWriteErr = function (req, res) {
  return function (err) {
    res(err);
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
            email: email.email,
            name: email.name,
            SurveyId: surveyRecord.id
          };
        });

        return models.Response.bulkCreate(responses);
      })
      // Finally respond to client with new survey record
      .then(function () {
        resolve(surveyRecord.SurveyBatchId);
      })
      .catch(function (err) {
        reject(err);
      });
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
        name: responses[0].name,
        tokens: tokens
      };
    })
    .value();
};

var batchResponse = function (batchId, models) {
  return when.promise(function (resolve, reject) {
    // Fetch all newly created surveys joined to new responses
    models.Survey.findAll({
      where: {
        SurveyBatchId: batchId
      },
      include: [models.Response]
    })
    // Respond with object containing
    // Array of newly created surveys
    // And array of email addresses and tokens to create links to responses
    .then(function (batch) {
      resolve({
        surveys: _.map(batch, function (survey) {
          return survey.toJSON();
        }),
        tokensByEmail: tokenByEmailFromBatch(batch),
        batchId: batchId
      });
    })
    .catch(reject);

  });
};

module.exports = {
  batchResponse: batchResponse,
  createSurvey: createSurvey,
  handleWriteErr: handleWriteErr,
  logMeta: logMeta,
  tokenByEmailFromBatch: tokenByEmailFromBatch
};
