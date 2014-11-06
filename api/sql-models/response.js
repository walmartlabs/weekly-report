
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

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
      isEmail: true
    },
    completedAt: {
      type: DataTypes.DATE
    },
    moralePicker: {
      type: DataTypes.TEXT
    },
    // TODO[7]: Enforce JSON array for accomplishments
    accomplishments: {
      type: DataTypes.TEXT
    },
    blockers: {
      type: DataTypes.TEXT
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
