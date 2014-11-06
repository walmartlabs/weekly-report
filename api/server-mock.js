var _ = require("lodash");

var liveServer = require("./server-single");

// A batch of surveys to mock with
var testSurveys = require("../test/api/survey-data");

liveServer(null, function (err, server) {
  if (err) { throw err; }

  // Add records
  server.inject({
    method: "POST",
    url: "/surveys/batch",
    payload: testSurveys
  }, function (res) {
    if (res.statusCode !== 200) {
      throw new Error("records failed to load");
    }

    var body = JSON.parse(res.payload);

    // Create link from newly created record tokens
    var link = _.find(body.tokensByEmail, function (response) {
      return response.email === "hi@example.com";
    })
      .tokens
      .join("...");

    // Add result for one of those records
    server.inject({
      method: "POST",
      url: "/responses",
      payload: {
        token: link.split("...")[0]
      }
    }, function (res) {
      if (res.statusCode !== 200) {
        throw new Error("failed to complete one response");
      }

      // Reroute to valid responses GET with known tokens
      server.route({
        method: "GET",
        path: "/dev/responses",
        handler: function (req, res) {
          res.redirect("/responses/" + link);
        }
      });
    });
  });
});
