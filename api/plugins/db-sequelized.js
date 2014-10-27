var _ = require("lodash");
var Sqlize = require("sequelize");

var surveySchema = require("../sql-models/survey");
var responseSchema = require("../sql-models/response");

exports.register = function (plugin, options, next) {
  // Only currently support dev mode
  if (options.dialect !== "sqlite" || options.storage) {
    throw new Error("Only in memory sqlite currently supported");
  }

  // Create db connection
  var sqlize = new Sqlize(
    options.database, options.user, options.pass,
    _.omit(options, ["database", "user", "pass"]));

  var Survey = surveySchema(sqlize, Sqlize);
  var Response = responseSchema(sqlize, Sqlize);

  // Relationships
  Survey.hasMany(Response);
  Response.belongsTo(Survey);

  var db = {
    Survey: Survey,
    Response: Response,
    sqlize: sqlize,
    Sqlize: Sqlize
  };

  // Expose sqlize objects to the application
  plugin.expose("models", db);

  next();
};

exports.register.attributes = {
  name: "sqlModels"
};
