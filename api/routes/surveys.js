/*
 * Route for creating survey
 *
 * @exports {function}
 * @param   {object}    server     server instance
 * @param   {object}    sqlSchema  models of sqlize instance
 */
module.exports = function (server, sqlSchema) {

  // Create new survey
  server.route({
    method: "POST",
    path: "/surveys",
    handler: function (req, res) {
      var survey = req.payload;
      // TODO: Verify data

      // First insert to Survey table
      sqlSchema.Survey.create(survey)
        .success(function (survey) {


        // sqlSchema.Reponse.create({
        //   emailToken: "asdfds",
        //   email: "kevin@email.com"
        // }).success(function(response) {
        //   survey.setResponses(response)
        //   .success(function(result) {
        //     console.log(result);
        //   });
        // });

          res(survey);
        })
        .error(function (err) {
          res(err);
        });

    }
  });
};
