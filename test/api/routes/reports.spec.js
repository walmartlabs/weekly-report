var _ = require("lodash");
var liveServer = require("../../../api/server-single");

// A batch of surveys to mock with
var testSurveys = require("../survey-data");

describe("api/routes/", function () {

  var server;

  // Get a surver instance
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

    it("POST: should 400 if email field not an email",
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

    // create `...` joined list of tokens to fetch from server
    before(function () {
      tokens = batch.tokensByEmail[0].tokens.join("...");
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

    it("POST with valid data should return 200",
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

      server.inject({
        method: "POST",
        url: "/responses",
        payload: completedResponse
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(200);
        });
      });
    });

    it("POST without accomplishments should 400",
      function (done) {

      var completedResponse = {
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
        payload: completedResponse
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(400);
        });
      });
    });
  });
});
