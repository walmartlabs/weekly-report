var _ = require("lodash");
var liveServer = require("../../../api/server-single");

// A batch of surveys to mock with
var responseData = require("../response-data");
var testSurveys = require("../survey-data");

describe("api/routes/", function () {

  var server;

  // Get a server instance
  before(function (done) {
    liveServer()
      .done(function (serverRef) {
        server = serverRef;
        done();
      });
  });

  // Shut down server
  after(function (done) {
    server.stop(done);
  });

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
          expect(res.statusCode).to.equal(200);
          _.each(newSurveys.surveys, function (survey, i) {
            expect(survey).to.contain(_.omit(testSurveys[i], "emails"));
          });
        });
      });
    });

    it("POST: should 400 if required field missing",
      function (done) {

      var testMissing = [_.omit(testSurveys, "projectName")];

      server.inject({
        method: "POST",
        url: "/surveys/batch",
        payload: testMissing
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(400);
        });
      });
    });

    it("POST: should 400 if creator email field not an email",
      function (done) {

      var testMissing = [_.omit(testSurveys[0], "creatorEmail")];
      testMissing[0].creatorEmail = "notanemail";

      server.inject({
        method: "POST",
        url: "/surveys/batch",
        payload: testMissing
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(400);
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
    var completedResponse;

    // create `...` joined list of tokens to fetch from server
    before(function () {
      tokens = batch.tokensByEmail[0].tokens.join("...");

      completedResponse = _.extend({
        token: tokens.split("...")[0]
      }, responseData);
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

    it("POST with valid data should return updated record",
      function (done) {

      server.inject({
        method: "POST",
        url: "/responses",
        payload: completedResponse
      }, function (res) {
        test.done(done, function () {
          var data = JSON.parse(res.payload);

          expect(res.statusCode).to.equal(200);
          _.each(completedResponse, function (value, key) {
            if (_.isArray(value)) {
              expect(data[key]).to.include.members(value);
            } else {
              expect(data[key]).to.equal(value);
            }
          });
        });
      });
    });

    it("POST without accomplishments should 400",
      function (done) {

      var badResponse = {
        token: tokens.split("...")[0],
        accomplishments: [" "],
        blockers: [
          "four",
          "five"
        ]
      };

      server.inject({
        method: "POST",
        url: "/responses",
        payload: badResponse
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(400);
        });
      });
    });
  });

  describe("api/routes/surveys", function () {

    it("should GET surveys if valid periodEnd date", function (done) {
      var periodEnd = testSurveys[0].periodEnd;

      server.inject({
        method: "GET",
        url: "/surveys/" + periodEnd,
      }, function (res) {
        test.done(done, function () {
          var data = JSON.parse(res.payload);

          expect(res.statusCode).to.equal(200);
          expect(data)
            .to.be.an("array")
            .with.length(1);
          expect(data[0]).to.include(_.omit(testSurveys[0], "emails"));
          expect(res.headers)
            .to.have.property("content-type",
              "application/json; charset=utf-8");
        });
      });
    });

    it("should GET error if invalid periodEnd date", function (done) {
      server.inject({
        method: "GET",
        url: "/surveys/invalidPeriodEnd"
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(400);
        });
      });
    });
  });
});
