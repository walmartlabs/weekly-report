
/*
 * Module adds sequelize models to an instance
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    projectName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  });

  return Survey;
};
