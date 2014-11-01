
/*
 * Module keeps batch numbers of surveys
 *
 * @exports {function}  To add models to instance
 */
// id, createdAt, updatedAt added automatically
module.exports = function (sqlize) {
  var SurveyBatch = sqlize.define("SurveyBatch", {});
  return SurveyBatch;
};
