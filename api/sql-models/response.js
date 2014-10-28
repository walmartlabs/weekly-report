
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var SHORT_CHARS = 255;
var LONG_CHARS = 65535;

module.exports = function (sqlize, DataTypes) {

  var Response = sqlize.define("Response", {
    token: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false,
      isEmail: true
    },
    completedAt: {
      type: DataTypes.DATE
    },
    howsItGoing: {
      type: DataTypes.STRING(LONG_CHARS)
    },
    // TODO[7]: Enforce JSON array for accomplishments
    accomplishments: {
      type: DataTypes.STRING(LONG_CHARS)
    },
    blockers: {
      type: DataTypes.STRING(LONG_CHARS)
    },
    privateFeedback: {
      type: DataTypes.STRING(LONG_CHARS)
    },
    reportedMorale: {
      type: DataTypes.STRING(SHORT_CHARS)
    }
  });

  return Response;
};
