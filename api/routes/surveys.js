/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 * @param   {object}    sqlSchema  models of sqlize instance
 */
module.exports = function (server) {

  // Create new survey
  server.route({
    method: "POST",
    path: "/surveys",
    handler: function (req, res) {
      var survey = req.payload;
      var models = req.server.plugins.sqlModels.models;
      // TODO: Verify data

      // First insert to Survey table
      models.Survey.create(survey)
        .then(function (survey) {

          res(survey);
        })
        .error(function (err) {
          res(err);
        });
    }
  });
};
