var _ = require("lodash");
var Sqlize = require("sequelize");

var surveySchema = require("../sql-models/survey");
var responseSchema = require("../sql-models/response");

var register = function (plugin, options, next) {
  options.server.log("info", "Using dialect: " + options.dialect);

  // Create db connection
  var sqlize = new Sqlize(
    options.database, options.user, options.pass,
    _.omit(options, ["server", "database", "user", "pass"]));

  var Survey = surveySchema(sqlize, Sqlize);
  var Response = responseSchema(sqlize, Sqlize);

  // Relationships
  Survey.hasMany(Response);
  Response.belongsTo(Survey);

  // Expose sqlize objects to the application
  plugin.expose("models", {
    Survey: Survey,
    Response: Response,
    sqlize: sqlize,
    Sqlize: Sqlize
  });

  next();
};

register.attributes = {
  name: "sqlModels"
};

module.exports = {
  register: register
};
