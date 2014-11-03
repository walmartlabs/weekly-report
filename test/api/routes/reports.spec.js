var _ = require("lodash");
var moment = require("moment");
var getServer = require("../../../api/server");

describe("api/routes/", function () {

  var server;

  // Get a surver instance
  before(function (done) {
    getServer(null, function (err, serverRef) {
      if (err) { return done(err); }

      server = serverRef;
      server.start(done);
    });
  });

  // Shut down server
  after(function (done) {
    server.stop(done);
  });

  // Test 'batch'
  var testSurveys = [
    {
      periodStart: moment("20140101", "YYYYMMDD").toISOString(),
      periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
      projectName: "Foo Project",
      creatorEmail: "creator@example.com",
      emails: ["hi@example.com", "lo@example.com"]
    },
    {
      periodStart: moment("20140115", "YYYYMMDD").toISOString(),
      periodEnd: moment("20140130", "YYYYMMDD").toISOString(),
      projectName: "Bar Project",
      creatorEmail: "creator3@example.com",
      emails: ["hi@example.com", "hilo@example.com"]
    }
  ];

  var batch;

  describe("api/routes/surveys/batch", function () {

    it("POST: should respond with survey records in new batch",
      function (done) {

      server.inject({
        method: "POST",
        url: "/surveys/batch",
        payload: testSurveys
      }, function (res) {
        var newSurveys = JSON.parse(res.payload);
        test.done(done, function () {
          _.each(newSurveys.surveys, function (survey, i) {
            expect(survey).to.contain(_.omit(testSurveys[i], "emails"));
          });
        });
      });
    });

    it("GET: should get survey with responses", function (done) {
      server.inject({
        method: "GET",
        url: "/surveys/batch/1"
      }, function (res) {
        batch = JSON.parse(res.payload);

        test.done(done, function () {
          expect(res.statusCode).to.equal(200);
          _.each(batch.surveys, function (survey, index) {
            expect(survey).to.contain(_.omit(testSurveys[index], "emails"));
          });
        });
      });
    });
  });

  describe("api/routes/responses", function () {
    // Tokens for hi@example.com
    var tokens;

    // create `...` joined list of tokens to fetch from server
    before(function () {
      tokens = _.chain(batch)
        .map(function (survey) {
          return survey.Responses;
        })
        .flatten()
        .filter(function (response) {
          return response.email === "hi@example.com";
        })
        .map(function (response) {
          return response.token;
        })
        .value()
        .join("...");
    });

    it("should GET response view if valid tokens", function (done) {
      server.inject({
        method: "GET",
        url: "/responses/" + tokens
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(200);
          expect(res.headers["content-type"])
            .to.equal("text/html; charset=utf-8");
        });
      });
    });

    it("should GET error if non valid tokens", function (done) {

      // create `...` joined list of tokens to fetch from server
      var badTokens = "badtoken1...badtoken2";

      server.inject({
        method: "GET",
        url: "/responses/" + badTokens
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(404);
        });
      });
    });

    it("should POST response data and return new response record",
      function (done) {

      var completedResponse = {
        token: tokens.split("...")[0],
        moralePicker: "1",
        accomplishments: [
          "one",
          "two",
          "three"
        ],
        blockers: [
          "four",
          "five"
        ],
        privateFeedback: "something private"
      };

      var completedResponseJSON = _.mapValues(
        _.omit(completedResponse, "token"), function (item) {

        return JSON.stringify(item);
      });

      server.inject({
        method: "POST",
        url: "/responses",
        payload: completedResponse
      }, function (res) {
        var models = server.plugins.sqlModels.models;
        models.Response.find({ where: {token: tokens.split("...")[0]}})
          .then(function (response) {
            test.done(done, function () {
              expect(response.dataValues).to.contain(completedResponseJSON);
              expect(res.statusCode).to.equal(200);
            });
          });
      });
    });
  });
});
