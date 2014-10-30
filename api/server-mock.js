var _ = require("lodash");
var moment = require("moment");

var liveServer = require("./server-single");

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

    server.route({
      method: "GET",
      path: "/dev/responses",
      handler: function (req, res) {
        // direct to actual route now that tokens are known
        res.redirect("/responses/" + link);
      }
    });
  });
});
