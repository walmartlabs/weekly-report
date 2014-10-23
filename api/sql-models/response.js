
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically
module.exports = function (sqlize, DataTypes) {

  var Response = sqlize.define("Response", {
    token:                { type: DataTypes.STRING(255),
                            allowNull: false,
                            unique: true
                          },
    email:                { type: DataTypes.STRING(255),
                            allowNull: false,
                            isEmail: true
                          },
    completedAt:          { type: DataTypes.DATE },
    howsItGoing:          { type: DataTypes.STRING(65535) },
    // TODO: Enforce JSON array for accomplishments
    accomplishments:      { type: DataTypes.STRING(65535) },
    blockers:             { type: DataTypes.STRING(65535) },
    privateFeedback:      { type: DataTypes.STRING(65535) },
    reportedMorale:       { type: DataTypes.STRING(255) }
  });

  return Response;
};
