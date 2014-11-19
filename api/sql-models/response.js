
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var storeJSON = require("../lib/store-json");

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
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    accomplishments: storeJSON("accomplishments", {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    }),
    blockers: storeJSON("blockers", {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    }),
    privateFeedback: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    SurveyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Model level validations
    validate: {
      // To post a response must have accomplishments
      requiredWithResponse: function () {
        if (this.completedAt && !this.accomplishments) {
          throw new Error("Accomplishments required");
        }
      }
    }
  });

  return Response;
};
