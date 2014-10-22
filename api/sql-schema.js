
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
var Sqlize = require("sequelize");

// id, createdAt, updatedAt added automatically
module.exports = function (sqlize) {

  var Survey = sqlize.define("Survey", {
    periodStart:     { type: Sqlize.DATE, allowNull: false },
    periodEnd:       { type: Sqlize.DATE, allowNull: false },
    creatorEmail:    { type: Sqlize.STRING(255),
                       allowNull: false,
                       isEmail: true
                     },
    projectName:     { type: Sqlize.STRING(255), allowNull: false }
  });

  // TODO: Compose key survey_id, email
  // TODO: Unique token
  var Response = sqlize.define("Response", {
    token:                { type: Sqlize.STRING(255), allowNull: false },
    email:                { type: Sqlize.STRING(255),
                            allowNull: false,
                            isEmail: true
                          },
    completedAt:          { type: Sqlize.DATE },
    howsItGoing:          { type: Sqlize.STRING(65535) },
    // TODO: Enforce JSON array for accomplishments
    accomplishments:      { type: Sqlize.STRING(65535) },
    blockers:             { type: Sqlize.STRING(65535) },
    privateFeedback:      { type: Sqlize.STRING(65535) },
    reportedMorale:       { type: Sqlize.STRING(255) }
  });

  Survey.hasMany(Response);

  return {
    Survey: Survey,
    Response: Response
  };
};
