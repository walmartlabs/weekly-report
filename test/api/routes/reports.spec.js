var _ = require("lodash");
var moment = require("moment");

var omitAuto = function (object) {
  return _.omit(object, ["id", "createdAt", "updatedAt"]);
};

describe("api/routes/reports", function () {
  var survey = {
    periodStart: moment().toISOString(),
    periodEnd: moment().toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@gmail.com",
    emails: ["hi@gmail.com, lo@gmail.com"]
  };

  var server;
  before(function (done) {
    require("../../../api/server")(function (serverOn) {
      server = serverOn;
      done();
    });
  });

  it("should create new survey", function (done) {
    server.inject({
      method: "POST",
      url: "/surveys",
      payload: survey

    }, function (res) {
      test.done(done, function () {

        var body = JSON.parse(res.payload);
        expect(res.statusCode).to.equal(200);
        expect(omitAuto(body)).to.deep.equal(_.omit(survey, "emails"));
      });
    });
  });

  it("should not create new survey if field missing", function (done) {
    var surveyMissing = _.omit(survey, "projectName");

    server.inject({
      method: "POST",
      url: "/surveys",
      payload: surveyMissing

    }, function (res) {
      test.done(done, function () {
        expect(res.statusCode).to.equal(500);
      });
    });
  });
});
