
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var validators = require("../lib/validators");
var SHORT_CHARS = 255;

module.exports = function (sqlize, DataTypes) {

  var Survey = sqlize.define("Survey", {
    periodStart: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      validate: {
        checkDate: validators.sqlizeValidDateString
      }
    },
    periodEnd: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      validate: {
        checkDate: validators.sqlizeValidDateString
      }
    },
    creatorEmail: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    projectName: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    },
    // A user defined project identifier
    projectId: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    },
    SurveyBatchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Survey;
};
