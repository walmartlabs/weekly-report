/**
 * Validation methods. Contains methods to be consumed by sqlize
 * and other methods to be consumed by Hapi route validation
 *
 * @type {Object}
 */

var _ = require("lodash");
var Joi = require("joi");
var moment = require("moment");

var SHORT_CHARS = 256;
var DATE_FORMAT = "YYYYMMDD";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

// Return boolean if date is valid string
var _isValidDateString = function (date) {
  return moment(date, DATE_FORMAT, true).isValid();
};

// ----------------------------------------------------------------------------
// Helpers/Default JOI
// ----------------------------------------------------------------------------

// Checks that date is correct length and only contains numbers
var _checkDate = Joi.string().trim()
  .length(DATE_FORMAT.length).regex(/^[0-9]*$/);

// Default short string checker
var _checkShortString = Joi.string().trim().min(1).max(SHORT_CHARS);

// Default email checker
var _checkEmail = Joi.string().trim().email();

// Email object checker
var _checkEmailObj = Joi.object().keys({
  email: _checkEmail.required(),
  name: _checkShortString.required()
})
.unknown(false);

// Validates survey object (used in batch survey post)
var _postSurvey = Joi.object().keys({
  periodStart: _checkDate.required(),
  periodEnd: _checkDate.required(),
  projectName: _checkShortString.required(),
  projectId: _checkShortString.required(),
  creatorEmail: _checkEmail.required(),
  emails: Joi.array().includes(_checkEmailObj).min(1).required()
})
.unknown(false);

// ----------------------------------------------------------------------------
// EXPOSED: Conform to sqlize validation
// ----------------------------------------------------------------------------

// Throw if date is not valid
var sqlizeValidDateString = function (date) {
  if (!_isValidDateString(date)) {
    throw new Error("Date string not valid", {
      value: date
    });
  }
};

// ----------------------------------------------------------------------------
// EXPOSED: Conform to Hapi validators (Joi or custom)
// ----------------------------------------------------------------------------

// For validating a single date field with DATE_FORMAT
var hapiValidDateString = function (fieldName) {
  return function (value, options, next) {
    if (!_isValidDateString(value[fieldName])) {
      return next(
        new Error("Invalid date string. Must be in format " + DATE_FORMAT));
    }

    next(null, value);
  };
};

// Validates array of surveys
var hapiPostBatch = function (value, options, next) {
  var schema = Joi.array()
    .includes(_postSurvey)
    .min(1)
    .required();

  // First check Joi schema
  Joi.validate(value, schema, function (err, data) {
    if (err) { return next(err); }
    // Then check that date values pass moment
    _.each(data, function (entry) {
      if (!_isValidDateString(entry.periodStart) ||
        !_isValidDateString(entry.periodEnd)) {

        err = new Error("periodStart and/or periodEnd not valid");
      }
    });

    next(err, value);
  });
};

// Validates a response submitted by client
var hapiPostResponse = Joi.object().keys({
  token: Joi.string().length(15).token().required(),
  accomplishments: Joi.array().min(1).includes(_checkShortString).required(),
  blockers: Joi.array().min(1).includes(_checkShortString),
  moralePicker: Joi.string().length(1),
  privateFeedback: Joi.string()
})
.unknown();

module.exports = {
  hapiPostBatch: hapiPostBatch,
  hapiPostResponse: hapiPostResponse,
  hapiValidDateString: hapiValidDateString,
  sqlizeValidDateString: sqlizeValidDateString
};
