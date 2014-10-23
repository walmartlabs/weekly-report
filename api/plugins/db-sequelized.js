var _ = require("lodash");
var Sqlize = require("sequelize");

var db = {};

exports.register = function (plugin, options, next) {
  // Create db connection
  var sqlize = new Sqlize(options.database, options.user, options.pass, {
    dialect: options.dialect || "mysql",
    port: options.port || 3306,
    storage: "./db/dev.sqlite3",
    logging: false
  });

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
