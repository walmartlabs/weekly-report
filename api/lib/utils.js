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

// Returns promise to lookup and dad survey for given response
var attachSurvey = function (response) {
  return when.promise(function (resolve, reject) {

    // Get associated survey
    response.getSurvey()
      .then(function (survey) {
        // Attach to response
        resolve(_.extend(response, {
          survey: survey
        }));
      }, function (err) {
        reject(err);
      });
  });
};

module.exports = {
  handleWriteErr: handleWriteErr,
  attachSurvey: attachSurvey
};
