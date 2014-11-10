
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var isValidDateString = require("../lib/utils").isValidDateString;
var SHORT_CHARS = 255;

module.exports = function (sqlize, DataTypes) {

  var Survey = sqlize.define("Survey", {
    periodStart: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    },
    periodEnd: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      validate: {
        isValidDateString: isValidDateString
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
