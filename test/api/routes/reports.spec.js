var _ = require("lodash");
var moment = require("moment");
var getServer = require("../../../api/server");

describe("api/routes/", function () {

  var server;

  before(function (done) {
    getServer(null, function (err, serverRef) {
      if (err) { return done(err); }

      server = serverRef;
      server.start(done);
    });
  });

  after(function (done) {
    server.stop(done);
  });

  var testSurveys = [
    {
      periodStart: moment("20140101", "YYYYMMDD").toISOString(),
      periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
      projectName: "Foo Project",
      creatorEmail: "creator@gmail.com",
      emails: ["hi@gmail.com", "lo@gmail.com"]
    },
    {
      periodStart: moment("20140115", "YYYYMMDD").toISOString(),
      periodEnd: moment("20140130", "YYYYMMDD").toISOString(),
      projectName: "Bar Project",
      creatorEmail: "creator3@gmail.com",
      emails: ["hi@gmail.com", "hilo@gmail.com"]
    }
  ];

  var batch;

  describe("api/routes/surveys/batch", function () {

    it("POST: should populate records and respond with survey records",
      function (done) {

      server.inject({
        method: "POST",
        url: "/surveys/batch",
        payload: testSurveys
      }, function (res) {
        var newSurveys = JSON.parse(res.payload);
        test.done(done, function () {
          _.each(newSurveys, function (survey, i) {
            expect(survey).to.contain(_.omit(testSurveys[i], "emails"));
          });
        });
      });
    });

    // TODO HERE ADD EXPECTS
    it("GET: should get survey with responses", function (done) {
      server.inject({
        method: "GET",
        url: "/surveys/batch/1"
      }, function (res) {
        batch = JSON.parse(res.payload);
        test.done(done, function () {
          expect(res.statusCode).to.equal(200);
        });
      });
    });
  });

  describe("api/routes/responses", function () {
    // Tokens for hi@gmail.com
    var tokens;

    // create `...` joined list of tokens to fetch from server
    before(function () {
      tokens = _.chain(batch)
        .map(function (survey) {
          return survey.Responses;
        })
        .flatten()
        .filter(function (response) {
          return response.email === "hi@gmail.com";
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

    it("should POST data and return 200 on valid response", function (done) {

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
