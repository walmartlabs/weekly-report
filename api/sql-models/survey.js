
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically

var SHORT_CHARS = 255;

module.exports = function (sqlize, DataTypes) {

  var Survey = sqlize.define("Survey", {
    periodStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    periodEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    creatorEmail: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    },
    projectName: {
      type: DataTypes.STRING(SHORT_CHARS),
      allowNull: false
    }
  });

  return Survey;
};
