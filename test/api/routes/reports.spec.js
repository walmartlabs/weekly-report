var _ = require("lodash");
var moment = require("moment");
var startServer = require("../../../api/server");

var stdizer = function (object) {
  if (object.periodStart) {
    object.periodStart = moment(object.periodStart).toISOString();
  }
  if (object.periodEnd) {
    object.periodEnd = moment(object.periodEnd).toISOString();
  }
  return _.omit(object, ["id", "createdAt", "updatedAt"]);
};

describe("api/routes/reports", function () {
  var testSurvey = {
    periodStart: moment("20140101", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@gmail.com",
    emails: ["hi@gmail.com", "lo@gmail.com"]
  };

  var apiRes;
  var resBody;
  var survey;
  var responses;
  var serverRef;

  after(function (done) {
    serverRef.stop(function () {
      done();
    });
  });

  before(function (done) {
    startServer(null, function (server) {
      serverRef = server;

      server.inject({
        method: "POST",
        url: "/surveys",
        payload: testSurvey
      }, function (res) {
        apiRes = res;
        resBody = JSON.parse(res.payload);
        // Go to db and get record
        var models = server.plugins.sqlModels.models;
        models.Survey.find({
          where: { projectName: testSurvey.projectName }
        })
        .then(function (surveyRecord) {
          survey = surveyRecord;
          models.Response.findAll({
            where: { SurveyId: surveyRecord.dataValues.id }
          })
          .then(function (responseRecords) {
            responses = responseRecords;
            done();
          });
        });
      });
    });
  });

  it("should respond with newly created survey object", function (done) {
    test.done(done, function () {
      expect(apiRes.statusCode).to.equal(200);
      expect(stdizer(resBody.newSurvey))
        .to.deep.equal(_.omit(testSurvey, "emails"));
    });
  });

  it("should find survey in database", function (done) {
    test.done(done, function () {
      expect(stdizer(survey.dataValues))
        .to.deep.equal(_.omit(testSurvey, "emails"));
    });
  });

  it("should find related responses in database", function (done) {
    test.done(done, function () {
      expect(responses[0].dataValues.email).to.equal(testSurvey.emails[0]);
      expect(responses[1].dataValues.email).to.equal(testSurvey.emails[1]);
    });
  });
});
