
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically
var validArrayJSON = require("../lib/utils").validArrayJSON;

var SHORT_CHARS = 255;

module.exports = function (sqlize, DataTypes) {

  var Response = sqlize.define("Response", {
    token: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    completedAt: {
      type: DataTypes.DATE
    },
    moralePicker: {
      type: DataTypes.TEXT
    },
    accomplishments: {
      type: DataTypes.TEXT,
      validate: {
        // Custom validator
        requiredWithAnswer: function (value) {
          // Only if trying to post an answer
          if (this.completedAt) {
            validArrayJSON({
              value: value,
              allowEmpty: false
            });
          }
        }
      }
    },
    blockers: {
      type: DataTypes.TEXT,
      validate: {
        validArrayJSON: function (value) {
          validArrayJSON({
            value: value,
            allowEmpty: true
          });
        }
      }
    },
    privateFeedback: {
      type: DataTypes.TEXT
    },
    SurveyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Response;
};
