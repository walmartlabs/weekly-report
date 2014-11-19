var _ = require("lodash");
var Sqlize = require("sequelize");

var surveySchema = require("../sql-models/survey");
var responseSchema = require("../sql-models/response");
var surveyBatchSchema = require("../sql-models/survey-batch");

var register = function (plugin, options, next) {
  // Create db connection
  var sqlize;

  // If url provided, connect via url
  // else use other config values to connect
  if (options.url) {
    sqlize = new Sqlize(options.url, options.options);
  } else {
    sqlize = new Sqlize(
      options.database, options.user, options.pass, options.options);
  }

  var Survey = surveySchema(sqlize, Sqlize);
  var SurveyBatch = surveyBatchSchema(sqlize, Sqlize);
  var Response = responseSchema(sqlize, Sqlize);

  var foreignKey = {
    onDelete: "restrict",
    onUpdate: "restrict"
  };

  // Relationships
  SurveyBatch.hasMany(Survey, foreignKey);
  Survey.belongsTo(SurveyBatch);

  Survey.hasMany(Response, foreignKey);
  Response.belongsTo(Survey);

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
