var _ = require("lodash");
var Sqlize = require("sequelize");

var surveySchema = require("../sql-models/survey");
var responseSchema = require("../sql-models/response");
var surveyBatchSchema = require("../sql-models/survey-batch");

var register = function (plugin, options, next) {
  options.server.log("info", "Using dialect: " + options.dialect);

  // Create db connection
  var sqlize = new Sqlize(
    options.database, options.user, options.pass,
    _.omit(options, ["server", "database", "user", "pass"]));

  var Survey = surveySchema(sqlize, Sqlize);
  var SurveyBatch = surveyBatchSchema(sqlize, Sqlize);
  var Response = responseSchema(sqlize, Sqlize);

  // Relationships
  SurveyBatch.hasMany(Survey);
  Survey.belongsTo(SurveyBatch, { foreignKeyConstraint: true });

  Survey.hasMany(Response);
  Response.belongsTo(Survey, { foreignKeyConstraint: true });

  // Expose sqlize objects to the application
  plugin.expose("models", {
    Survey: Survey,
    Response: Response,
    SurveyBatch: SurveyBatch,
    sqlize: sqlize
  });

  next();
};

register.attributes = {
  name: "sqlModels"
};

module.exports = {
  register: register
};
