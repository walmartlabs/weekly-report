
/**
 * Adds a getter and setter to a sqlize model field to store data as JSON string
 *
 * @param   {string}  fieldName      Field name.
 * @param   {object}  fieldSettings  Sqlize settings object for a field.
 * @exports {function}
 */
var _ = require("lodash");

var storeJSON = function (fieldName, fieldSettings) {
  return _.merge({
    set: function (value) {
      return this.setDataValue(fieldName, JSON.stringify(value));
    },
    get: function () {
      return JSON.parse(this.getDataValue(fieldName));
    }
  }, fieldSettings);
};

module.exports = storeJSON;
