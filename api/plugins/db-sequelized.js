var _ = require("lodash");
var Sqlize = require("sequelize");
var db = {};

exports.register = function (plugin, options, next) {
  // Start sqlite if no database defined
  if (options.dialect === "sqlite" && !options.storage) {

  // Only this mode currently supported
  } else {
    throw new Error("Only in memory sqlite currently supported");
  }

  // Create db connection
  var sqlize = new Sqlize(
    options.database, options.user, options.pass,
    _.omit(options, ["database", "user", "pass"]));

  var Survey = require("../sql-models/survey")(sqlize, Sqlize);
  var Response = require("../sql-models/response")(sqlize, Sqlize);

  db = {
    Survey: Survey,
    Reponse: Response
  };

  // Relationships
  Survey.hasMany(Response);

  // Expose sqlize objects to the application
  plugin.expose("models", _.merge(db, { sqlize: sqlize, Sqlize: Sqlize }));

  next();
};

exports.register.attributes = {
  name: "sqlModels"
};
