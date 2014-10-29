var path = require("path");

var moment = require("moment");
var liveServer = require("./server-single");

liveServer(null, function (err, server) {
  if (err) {
    throw err;
  }

  // load db with test data
  var testSurvey = {
    periodStart: moment("20140101", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@gmail.com",
    emails: ["hi@gmail.com", "lo@gmail.com"]
  };

  server.inject({
    method: "POST",
    url: "/surveys",
    payload: testSurvey
  }, function (res) {
    if (res.statusCode !== 200) {
      throw new Error("records failed to load");
    }
  });

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../build")
      }
    }
  });
});
