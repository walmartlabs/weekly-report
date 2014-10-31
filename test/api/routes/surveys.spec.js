var _ = require("lodash");
var moment = require("moment");
var getServer = require("../../../api/server");

var stdizer = function (object) {
  if (object.periodStart) {
    object.periodStart = moment(object.periodStart).toISOString();
  }
  if (object.periodEnd) {
    object.periodEnd = moment(object.periodEnd).toISOString();
  }
  return _.omit(object, ["id", "createdAt", "updatedAt"]);
};

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

  var testSurvey = {
    periodStart: moment("20140101", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@gmail.com",
    emails: ["hi@gmail.com", "lo@gmail.com"]
  };

  var responseRecords;

  describe("api/routes/reports", function () {

    it("should populate records and respond with survey record",
      function (done) {

      var survey;

      server.inject({
        method: "POST",
        url: "/surveys",
        payload: testSurvey
      }, function (res) {
        var resBody = JSON.parse(res.payload);
        responseRecords = resBody.newResponses;

        // Go to db and get record
        var models = server.plugins.sqlModels.models;
        models.Survey.find({
          where: { projectName: testSurvey.projectName }
        })
          .then(function (foundSurvey) {
            survey = foundSurvey;
            return models.Response.findAll({
              where: { SurveyId: survey.dataValues.id }
            });
          })
          .then(function (response) {
            test.done(done, function () {
              // API response assertions
              expect(res.statusCode).to.equal(200);
              expect(stdizer(resBody.newSurvey))
                .to.deep.equal(_.omit(testSurvey, "emails"));
              expect(resBody.newResponses).to.not.be.null;

              // Database record assertions
              expect(stdizer(survey.dataValues))
                .to.deep.equal(_.omit(testSurvey, "emails"));
              expect(response[0].dataValues.email)
                .to.equal(testSurvey.emails[0]);
              expect(response[1].dataValues.email)
                .to.equal(testSurvey.emails[1]);
            });
          });
      });
    });
  });

  describe("api/routes/responses", function () {

    var tokens;

    // create `...` joined list of tokens to fetch from server
    before(function () {
      tokens = _.map(responseRecords, function (record) {
        return record.token;
      }).join("...");
    });

    it("should GET response view if valid tokens", function (done) {
      server.inject({
        method: "GET",
        url: "/responses/" + tokens
      }, function (res) {
        test.done(done, function () {
          expect(res.statusCode).to.equal(200);
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

    it("should return new response record on valid POST", function (done) {

      var completedResponse = {
        token: tokens.split("...")[0],
        moralePicker: 1,
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
  });
});
