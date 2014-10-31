var _ = require("lodash");
var moment = require("moment");

var liveServer = require("./server-single");

// TODO: This is unrealistic as serving up reponses
// for two different users. When add survey POST that
// takes many projects can update this.
liveServer(null, function (err, server) {
  if (err) { throw err; }

  // load db with test data
  var testSurvey = {
    periodStart: moment("20140101", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@gmail.com",
    emails: ["hi@gmail.com", "lo@gmail.com"]
  };

  // Add records
  server.inject({
    method: "POST",
    url: "/surveys",
    payload: testSurvey
  }, function (res) {
    if (res.statusCode !== 200) {
      throw new Error("records failed to load");
    }

    // Create link from newly created record tokens
    var responseRecords = JSON.parse(res.payload).newResponses;
    var link = _.map(responseRecords, function (record) {
      return record.token;
    }).join("...");

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
