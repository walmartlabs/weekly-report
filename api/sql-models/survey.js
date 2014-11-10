
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var isYYYYMMDD = require("../lib/utils").isYYYYMMDD;
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
        isYYYYMMDD: isYYYYMMDD
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
